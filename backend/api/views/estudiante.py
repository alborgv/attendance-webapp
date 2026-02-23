from urllib import request
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.db.models import Count, Q, F
from django.utils import timezone
from django.utils.dateparse import parse_date
from datetime import date
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from ..pagination import StandardResultsSetPagination
from ..permissions import IsMonitor, IsAdmin
from ..models import UserProfile, Asistencia
from ..serializers import EstudianteAusenteSerializer, EstudianteRiesgoSerializer, UserSerializer, UserProfileBasicSerializer, CrearEstudianteExtraSerializer
from ..filters import UserFilter, UserBasicFilter, EstudianteAusenteRangoFilter, EstudianteRiesgoFilter

class UserView(generics.ListAPIView):
    filter_backends = [DjangoFilterBackend]
    serializer_class = UserSerializer
    filterset_class = UserFilter
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return (
            User.objects
            .select_related('profile')
            .only(
                'id', 'username', 'email', 'first_name', 'last_name',
                'is_staff', 'is_active', 'date_joined', 'last_login',
                'profile__id'
            )
            .order_by('id')
        )
    
class UserBasicView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = UserProfileBasicSerializer
    filterset_class = UserBasicFilter
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return (
            UserProfile.objects
            .select_related("user")
            .filter(role="estudiante")
            .order_by("user__username", 'id')
        )
        

class CrearEstudianteExtraView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = CrearEstudianteExtraSerializer
    permission_classes = [IsMonitor | IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class EstudiantesRiesgoView(ListAPIView):
    serializer_class = EstudianteRiesgoSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = EstudianteRiesgoFilter

    def get_queryset(self):
        return (
            UserProfile.objects
            .filter(
                role='estudiante',
                asistencias__estado='A',
                asistencias__curso__estado='A'
            )
            .annotate(
                total_inasistencia=Count(
                    'asistencias',
                    filter=Q(asistencias__estado='A')
                )
            )
            .filter(total_inasistencia__gt=3)
            .distinct()
        )

class EstudianteAusenteRangoView(ListAPIView):
    serializer_class = EstudianteAusenteSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = EstudianteAusenteRangoFilter
    
    
    def get_queryset(self):
        queryset = (
            Asistencia.objects
            .select_related("estudiante", "curso")
            .filter(
                estado="A",
                estudiante__role="estudiante",
                curso__estado="A",
            )
            .annotate(
                total_inasistencia=Count(
                    "estudiante__asistencias",
                    filter=Q(
                        estudiante__asistencias__estado="A",
                        estudiante__asistencias__curso=F("curso"),
                    ),
                    distinct=True,
                )
            )
            .order_by(
                "estudiante__primer_apellido",
                "estudiante__segundo_apellido",
                "estudiante__primer_nombre",
                "estudiante__segundo_nombre",
                "curso__modulo"
            )
        )

        return queryset