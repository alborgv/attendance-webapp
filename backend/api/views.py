from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.utils import timezone

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsMonitor, IsAdmin
from .models import UserProfile, Curso, Asistencia
from .serializers import AsistenciaMetricasSerializer, ChangeMonitorRoleSerializer, MonitorSerializer, UserSerializer, CursoSerializer, AsistenciaSerializer, AsistenciaBulkSerializer, UserProfileBasicSerializer, CrearEstudianteExtraSerializer
from .filters import UserFilter, CursoFilter, AsistenciaFilter, UserBasicFilter

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = UserSerializer
    filterset_class = UserFilter
    
class UserBasicView(generics.ListAPIView):
    filter_backends = [DjangoFilterBackend]
    serializer_class = UserProfileBasicSerializer
    filterset_class = UserBasicFilter

    def get_queryset(self):
        return UserProfile.objects.all()

    def list(self, request, *args, **kwargs):
        user_profiles = self.filter_queryset(self.get_queryset())
        
        return Response([
            {
                "id": up.id,
                "tipo_identificacion": up.tipo_identificacion,
                "numero_identificacion": up.numero_identificacion,
                "nombre_completo": up.nombre_completo,
                "celular": up.celular,
            }
            for up in user_profiles
        ])
        
class CrearEstudianteExtraView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = CrearEstudianteExtraSerializer
    permission_classes = [IsMonitor | IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_profile = serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class CursoView(generics.ListAPIView):
    queryset = Curso.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = CursoSerializer
    filterset_class = CursoFilter

class CursoUpdateView(generics.UpdateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [IsMonitor | IsAdmin]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', True)
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
class CrearCursoView(generics.CreateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [IsMonitor | IsAdmin]

    def perform_create(self, serializer):
        serializer.save(monitor=self.request.user.profile)

    
class AsistenciaView(generics.ListAPIView):
    queryset = Asistencia.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = AsistenciaSerializer
    filterset_class = AsistenciaFilter
        
class CrearAsistenciaView(generics.CreateAPIView):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaBulkSerializer
    permission_classes = [IsMonitor | IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        asistencias_creadas = serializer.save()
        
        response_serializer = AsistenciaSerializer(asistencias_creadas, many=True)
        
        return Response({
            "message": f"Se procesaron {len(asistencias_creadas)} asistencias",
            "asistencias": response_serializer.data
        }, status=status.HTTP_201_CREATED)
        

class AsistenciaMetricasView(APIView):
    def get(self, request):
        try:            
            today = timezone.now().date()
            
            cursos_activos = Curso.objects.filter(estado='A').count()
            total_estudiantes = UserProfile.objects.filter(
                curso_estudiantes__estado='A'
            ).distinct().count()
            total_ausentes = Asistencia.objects.filter(
                estado='A',
                curso__estado='A',
                fecha=timezone.localdate()
            ).count()
            modulo_mas_ausentes = (
                Asistencia.objects
                .filter(estado='A', curso__estado='A')
                .values('curso__id', 'curso__modulo')
                .annotate(total=Count('id'))
                .order_by('-total')
                .first()
            )
            
            nombre_modulo_mas_ausentes = modulo_mas_ausentes.get('curso__modulo') if modulo_mas_ausentes else None
            id_modulo_mas_ausentes = modulo_mas_ausentes.get('curso__id') if modulo_mas_ausentes else None

            total_ausentes_mes = Asistencia.objects.filter(
                estado='A',
                fecha__year=today.year,
                fecha__month=today.month
            ).count()
            estudiantes_con_bajas = (
                Asistencia.objects
                .filter(estado='A')
                .values('estudiante')
                .annotate(total=Count('id'))
                .filter(total__gt=3)
                .count()
            )
            
            metrics_data = {
                'cursos_activos': cursos_activos,
                'total_estudiantes': total_estudiantes,
                'total_ausentes': total_ausentes,
                'modulo_mas_ausentes': nombre_modulo_mas_ausentes,
                'id_modulo_mas_ausentes': id_modulo_mas_ausentes,
                'total_ausentes_mes': total_ausentes_mes,
                'estudiantes_con_bajas': estudiantes_con_bajas,
                'last_updated': timezone.now()
            }
            serializer = AsistenciaMetricasSerializer(metrics_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error al obtener métricas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class MonitorListView(generics.ListAPIView):
    serializer_class = MonitorSerializer
    permission_class = [IsMonitor | IsAdmin]

    def get_queryset(self):
        return (
            User.objects
            .select_related('profile')
            .filter(profile__role='monitor')
        )
        
class AddMonitorView(generics.GenericAPIView):
    serializer_class = ChangeMonitorRoleSerializer
    queryset = User.objects.select_related('profile')
    permission_classes = [IsAdmin] 

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        print("USER:", user)
        profile = user.profile
        
        if profile.role == 'monitor':
            return Response(
                {"detail": "El usuario ya es monitor"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.role = 'monitor'
        profile.save(update_fields=['role'])

        return Response(
            {"detail": "Usuario asignado como monitor correctamente"},
            status=status.HTTP_200_OK
        )
        
class DeleteMonitorView(generics.GenericAPIView):
    serializer_class = ChangeMonitorRoleSerializer
    queryset = User.objects.select_related('profile')
    permission_classes = [IsAdmin]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        print("USER:", user)
        profile = user.profile

        if profile.role != 'monitor':
            return Response(
                {"detail": "El usuario no es monitor"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.role = 'estudiante'
        profile.save(update_fields=['role'])

        return Response(
            {"detail": "Rol de monitor removido correctamente"},
            status=status.HTTP_200_OK
        )
