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
    path('curso/lista/', CursoListView.as_view(), name='curso_lista'),
    path('curso/crear/', CrearCursoView.as_view(), name='crear_curso'),
    path('curso/<int:pk>/estado/', CursoChangeStatusView.as_view(), name='cambiar_estado_curso'),
    path('curso/<int:pk>/agregar_estudiante/', CursoUpdateView.as_view(), name='agregar_estudiante'),
    path('asistencia/', AsistenciaView.as_view(), name='asistencia'),
    path('asistencia/crear/', CrearAsistenciaView.as_view(), name='crear_asistencia'),
    path('asistencia/metricas/', AsistenciaMetricasView.as_view(), name='metricas_asistencia'),
    path('monitores/', MonitorListView.as_view(), name='lista_monitores'),
    path('monitores/crear/', MonitorCreateView.as_view(), name='crear_monitor'),
    path('monitores/<int:id>/role/', MonitorRoleView.as_view(), name='monitor_role'),
    path('users/riesgo_de_baja/', EstudiantesRiesgoView.as_view(), name='riesgo_de_baja'),
    path('excel/export/', ExportExcelView.as_view(), name='export_excel'),
    path('excel/upload/', UploadExcelView.as_view(), name='upload_excel'),
    path('asistencia/ausencias/', EstudianteAusenteRangoView.as_view(), name='ausencias'),
    path("users/<int:id>/change_password/", ChangeUserPasswordView.as_view(), name="cambiar_contrasena"),
]