from django.db.models import Count
from django.utils import timezone

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from ..filters import AsistenciaFilter
from ..models import Asistencia, Curso, UserProfile
from ..permissions import IsAdmin, IsMonitor
from ..serializers import AsistenciaBulkSerializer, AsistenciaMetricasSerializer, AsistenciaSerializer


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
        print("SERI:", serializer)
        asistencias_creadas = serializer.save()
        
        response_serializer = AsistenciaSerializer(asistencias_creadas, many=True)
        # print("AC:", asistencias_creadas[0])
        print("RS:", response_serializer.data)
        return Response({
            "message": f"Se procesaron {len(asistencias_creadas)} asistencias",
            "asistencias": response_serializer.data
        }, status=status.HTTP_201_CREATED)
        

class AsistenciaMetricasView(APIView):
    def get(self, request):
        try:            
            today = timezone.now()
            
            cursos_activos = Curso.objects.filter(estado='A').count()
            total_estudiantes = UserProfile.objects.filter(role="estudiante").distinct().count()
            total_estudiantes_activos = UserProfile.objects.filter(role="estudiante", estado="A").distinct().count()
            total_ausentes = Asistencia.objects.filter(
                estado='A',
                curso__estado='A',
                fecha=timezone.now()
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
                'total_estudiantes_activos': total_estudiantes_activos,
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