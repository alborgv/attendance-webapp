import django_filters
from django.db.models import Q, Value, CharField
from django.db.models.functions import Concat, Coalesce
from django.contrib.auth.models import User
from .models import Asistencia, UserProfile, Curso

class UserBasicFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = UserProfile
        fields = []

    def filter_search(self, queryset, name, value):
        queryset = queryset.annotate(
            full_name=Concat(
                Coalesce('primer_nombre', Value('')), Value(' '),
                Coalesce('segundo_nombre', Value('')), Value(' '),
                Coalesce('primer_apellido', Value('')), Value(' '),
                Coalesce('segundo_apellido', Value('')),
                output_field=CharField()
            )
        )

        return queryset.filter(
            Q(user__username__icontains=value) |
            Q(full_name__icontains=value) |
            Q(numero_identificacion__icontains=value)
        )


class UserFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(
        field_name='username',
        lookup_expr='icontains'
    )

    class Meta:
        model = User
        fields = ['username']

class CursoFilter(django_filters.FilterSet):
    curso_id = django_filters.NumberFilter(field_name='id')
    monitor_id = django_filters.NumberFilter(field_name='monitor__id')
    monitor_username = django_filters.CharFilter(field_name='monitor__user__username', lookup_expr='exact')
    
    class Meta:
        model = Curso
        fields = ['curso_id', 'monitor_id', 'monitor_username', 'estado']
    
class AsistenciaFilter(django_filters.FilterSet):
    fecha = django_filters.DateFilter(field_name='fecha', lookup_expr='exact')
    estado = django_filters.ChoiceFilter(choices=Asistencia.ESTADOS_ASISTENCIA)
    curso = django_filters.ModelChoiceFilter(queryset=Curso.objects.all())

    class Meta:
        model = Asistencia
        fields = ['fecha', 'estado', 'curso']