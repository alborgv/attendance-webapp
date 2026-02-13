from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

from rest_framework import generics
from rest_framework.response import Response

from ..filters import CursoFilter
from ..models import Curso
from ..permissions import IsAdmin, IsMonitor
from ..serializers import CursoEstadoSerializer, CursoListSerializer, CursoSerializer
from ..pagination import StandardResultsSetPagination

class CursoView(generics.ListAPIView):
    queryset = Curso.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = CursoSerializer
    filterset_class = CursoFilter

class CursoListView(generics.ListAPIView):
    serializer_class = CursoListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CursoFilter
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return (
            Curso.objects
            .select_related('monitor')
            .annotate(total_estudiantes=Count('estudiantes'))
            .order_by('-fecha')
        )
        
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
        serializer.save(monitor=self.request.user)

class CursoChangeStatusView(generics.UpdateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoEstadoSerializer
    permission_classes = [IsMonitor | IsAdmin]
    http_method_names = ["patch"]