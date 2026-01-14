from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .views import *
from .serializers import TokenSerializer

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(serializer_class=TokenSerializer), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UserView.as_view(), name='users'),
    path('users_basic/', UserBasicView.as_view(), name='users_basic'),
    path('users_basic/crear/', CrearEstudianteExtraView.as_view(), name='crear_users_basic'),
    path('curso/', CursoView.as_view(), name='curso'),
    path('curso/crear/', CrearCursoView.as_view(), name='crear_curso'),
    path('curso/<int:pk>/agregar_estudiante/', CursoUpdateView.as_view(), name='agregar_estudiante'),
    path('crear_curso/', CrearCursoView.as_view(), name='crear_curso'),
    path('asistencia/', AsistenciaView.as_view(), name='asistencia'),
    path('asistencia/crear/', CrearAsistenciaView.as_view(), name='crear_asistencia'),
    path('asistencia/metricas/', AsistenciaMetricasView.as_view(), name='metricas_asistencia'),
    path('monitores/', MonitorListView.as_view(), name='lista_monitores'),
    path('users/<int:pk>/agregar_monitor/', AddMonitorView.as_view(), name='agregar_monitor'),
    path('users/<int:pk>/eliminar_monitor/', DeleteMonitorView.as_view(), name='eliminar_monitor'),
]