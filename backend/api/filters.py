import django_filters
from django.db.models import Q, Value, F
from django.db.models.functions import Concat, Coalesce
from django.contrib.auth.models import User

from .helper import normalize_text
from .models import Asistencia, UserProfile, Curso

JORNADA_MAP = {
    'MANANA 7 - 9:30': 'MAÑANA 7 - 9:30',
    'MANANA 10:15 - 12:45': 'MAÑANA 10:15 - 12:45',
    'TARDE 1:30 - 4': 'TARDE 1:30 - 4',
    'VIERNES TARDE': 'VIERNES TARDE',
}

class UserBasicFilter(django_filters.FilterSet):
    # username = django_filters.CharFilter(
    #     field_name="user__username",
    #     lookup_expr="istartswith"
    # )

    estado = django_filters.CharFilter(
        field_name="estado"
    )

    jornada = django_filters.CharFilter(
        field_name="jornada"
    )

    username = django_filters.CharFilter(method="filter_username")

    class Meta:
        model = UserProfile
        fields = ["username"]

    def filter_jornada(self, queryset, name, value):
        normalized = normalize_text(value)
        real_value = JORNADA_MAP.get(normalized)

        if not real_value:
            return queryset.none()


        return queryset.filter(jornada=real_value)

    def filter_username(self, queryset, name, value):
        
        if value.isdigit():
            return queryset.filter(numero_identificacion__icontains=value)
        
        queryset = queryset.annotate(
            nombre_completo_db=Concat(
                Coalesce(F('primer_nombre'), Value('')),
                Value(' '),
                Coalesce(F('segundo_nombre'), Value('')),
                Value(' '),
                Coalesce(F('primer_apellido'), Value('')),
                Value(' '),
                Coalesce(F('segundo_apellido'), Value('')),
            )
        )

        return queryset.filter(
            Q(nombre_completo_db__icontains=value) |
            Q(numero_identificacion__icontains=value)
        )


class UserFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(
        field_name='username',
        lookup_expr='istartswith'
    )

    class Meta:
        model = User
        fields = ['username']

class CursoFilter(django_filters.FilterSet):
    curso_id = django_filters.NumberFilter(field_name='id')
    monitor_id = django_filters.NumberFilter(field_name='monitor__id')
    monitor_username = django_filters.CharFilter(field_name='monitor__username', lookup_expr='exact')
    
    estado = django_filters.CharFilter(
        field_name="estado"
    )
    
    modulo = django_filters.CharFilter(
        field_name="modulo",
        lookup_expr="icontains"
    )
    
    class Meta:
        model = Curso
        fields = ['curso_id', 'monitor_id', 'monitor_username', 'estado', 'modulo']
    
class AsistenciaFilter(django_filters.FilterSet):
    fecha = django_filters.DateFilter(field_name='fecha', lookup_expr='exact')
    estado = django_filters.ChoiceFilter(choices=Asistencia.ESTADOS_ASISTENCIA)
    curso = django_filters.ModelChoiceFilter(queryset=Curso.objects.all())

    class Meta:
        model = Asistencia
        fields = ['fecha', 'estado', 'curso']
        

class EstudianteAusenteRangoFilter(django_filters.FilterSet):
    
    estado = django_filters.CharFilter(
        field_name="estudiante__estado"
    )
    fecha_inicio = django_filters.DateFilter(
        field_name="fecha", lookup_expr="gte"
    )
    fecha_fin = django_filters.DateFilter(
        field_name="fecha", lookup_expr="lte"
    )
    modulo = django_filters.CharFilter(
        field_name="curso__modulo", lookup_expr="icontains"
    )
    jornada = django_filters.CharFilter(
        field_name="estudiante__jornada", lookup_expr="iexact"
    )
    
    username = django_filters.CharFilter(method="filter_username")

    def filter_username(self, queryset, name, value):
        
        if value.isdigit():
            return queryset.filter(estudiante__numero_identificacion__icontains=value)
        
        queryset = queryset.annotate(
            nombre_completo_db=Concat(
                Coalesce(F('estudiante__primer_nombre'), Value('')),
                Value(' '),
                Coalesce(F('estudiante__segundo_nombre'), Value('')),
                Value(' '),
                Coalesce(F('estudiante__primer_apellido'), Value('')),
                Value(' '),
                Coalesce(F('estudiante__segundo_apellido'), Value('')),
            )
        )

        return queryset.filter(
            Q(nombre_completo_db__icontains=value) |
            Q(estudiante__numero_identificacion__icontains=value)
        )

    class Meta:
        model = Asistencia
        fields = []


class EstudianteRiesgoFilter(django_filters.FilterSet):

    estado = django_filters.CharFilter(
        field_name="estado"
    )

    jornada = django_filters.CharFilter(
        field_name="jornada",
        lookup_expr="iexact"
    )

    username = django_filters.CharFilter(method="filter_username")

    def filter_username(self, queryset, name, value):

        if value.isdigit():
            return queryset.filter(numero_identificacion__icontains=value)

        queryset = queryset.annotate(
            nombre_completo_db=Concat(
                Coalesce(F('primer_nombre'), Value('')),
                Value(' '),
                Coalesce(F('segundo_nombre'), Value('')),
                Value(' '),
                Coalesce(F('primer_apellido'), Value('')),
                Value(' '),
                Coalesce(F('segundo_apellido'), Value('')),
            )
        )

        return queryset.filter(
            Q(nombre_completo_db__icontains=value) |
            Q(numero_identificacion__icontains=value)
        )

    class Meta:
        model = UserProfile
        fields = ["estado", "jornada", "username"]




class MonitorFilter(django_filters.FilterSet):

    estado = django_filters.CharFilter(
        field_name="profile__estado"
    )

    username = django_filters.CharFilter(method="filter_username")

    def filter_username(self, queryset, name, value):

        if value.isdigit():
            return queryset.filter(profile__numero_identificacion__icontains=value)

        queryset = queryset.annotate(
            nombre_completo_db=Concat(
                Coalesce(F('profile__primer_nombre'), Value('')),
                Value(' '),
                Coalesce(F('profile__segundo_nombre'), Value('')),
                Value(' '),
                Coalesce(F('profile__primer_apellido'), Value('')),
                Value(' '),
                Coalesce(F('profile__segundo_apellido'), Value('')),
            )
        )

        return queryset.filter(
            Q(nombre_completo_db__icontains=value) |
            Q(profile__numero_identificacion__icontains=value)
        )

    class Meta:
        model = User
        fields = ["estado", "username"]
