from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from django.utils.translation import gettext_lazy as _
from .models import UserProfile, Curso, Asistencia


class TokenSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": _("Usuario o contraseña incorrectos."),
        "invalid_credentials": _("Usuario o contraseña incorrectos."),
        "user_not_found": _("El usuario no existe."),
        "user_inactive": _("La cuenta está desactivada."),
        "password_changed": _("Tu contraseña fue actualizada. Inicia sesión nuevamente."),
    
        "account_locked": _("La cuenta está temporalmente bloqueada por múltiples intentos fallidos."),
        "token_invalid": _("El token no es válido."),
        "token_expired": _("La sesión ha expirado. Inicia sesión nuevamente."),
        "authentication_failed": _("No fue posible autenticar al usuario."),
    
        "required": _("Este campo es obligatorio."),
        "blank": _("Este campo no puede estar vacío."),
        "invalid": _("El valor ingresado no es válido."),

        "permission_denied": _("No tienes permisos para realizar esta acción."),
    }
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        try:
            profile = UserProfile.objects.get(user=user)
            token['role'] = profile.role
            token['primer_nombre'] = profile.primer_nombre
            token['segundo_nombre'] = profile.segundo_nombre
            token['primer_apellido'] = profile.primer_apellido
            token['segundo_apellido'] = profile.segundo_apellido
            token['numero_identificacion'] = profile.numero_identificacion
        except UserProfile.DoesNotExist:
            token['role'] = 'estudiante'
            token['primer_nombre'] = user.first_name
            token['primer_apellido'] = user.last_name
            
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        
        try:
            profile = UserProfile.objects.get(user=user)
            data['user']['profile'] = {
                'role': profile.role,
                'primer_nombre': profile.primer_nombre,
                'segundo_nombre': profile.segundo_nombre,
                'primer_apellido': profile.primer_apellido,
                'segundo_apellido': profile.segundo_apellido,
                'numero_identificacion': profile.numero_identificacion,
            }
        except UserProfile.DoesNotExist:
            data['user']['profile'] = {
                'role': 'estudiante',
                'primer_nombre': user.first_name,
                'primer_apellido': user.last_name,
            }
            
        return data

    
class UserProfileSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile        
        fields = [
            'id', 'user', 'role',
            'tipo_identificacion', 'numero_identificacion', 'lugar_expedicion_documento',
            'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido',
            'fecha_nacimiento', 'lugar_nacimiento', 'sexo', 'estrato', 'estado_civil',
            'tipo_sangre', 'edad',
            'telefono', 'celular', 'correo_electronico', 'direccion', 'pais',
            'lugar_residencia', 'barrio',
            'sede', 'jornada', 'programa', 'grupo', 'periodo', 'nivel',
            'nivel_formacion', 'codigo_matricula',
            'eps', 'ars', 'aseguradora', 'grupo_sisben',
            'pertenece_regimen_contributivo',
            'ocupacion', 'discapacidad', 'medio_transporte', 'multiculturalidad', 'zona',
            'estado', 'tipo_cancelacion', 'fecha_matricula', 'formalizada',
            'condicion_matricula', 'ultima_actualizacion',
            'nombre_completo',
        ]

class UserProfileBasicSerializer(serializers.ModelSerializer):    
    id = serializers.IntegerField(source="user.id", read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'nombre_completo', 'tipo_identificacion', 'numero_identificacion', 'celular', 'jornada', 'estado']
        
class UserSerializer(serializers.ModelSerializer):   
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_staff', 'is_active', 'date_joined', 'last_login',
            'profile'
        ]


class CrearEstudianteExtraSerializer(serializers.ModelSerializer):
    primer_nombre = serializers.CharField(max_length=50, required=True)
    numero_identificacion = serializers.CharField(max_length=20, required=True)
    tipo_identificacion = serializers.ChoiceField(choices=UserProfile.TIPOS_IDENTIFICACION, required=True)
    celular = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = UserProfile
        fields = ['primer_nombre', 'numero_identificacion', 'tipo_identificacion', 'celular']

    def validate_numero_identificacion(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este número de identificación")
        if UserProfile.objects.filter(numero_identificacion=value).exists():
            raise serializers.ValidationError("Ya existe un perfil con este número de identificación")
        return value

    def create(self, validated_data):
        primer_nombre = validated_data.pop('primer_nombre')
        numero_identificacion = validated_data.pop('numero_identificacion')
        tipo_identificacion = validated_data.pop('tipo_identificacion')
        celular = validated_data.pop('celular', '')

        user = User.objects.create_user(
            username=numero_identificacion,
            first_name=primer_nombre,
            password=numero_identificacion
        )

        user_profile = UserProfile.objects.create(
            user=user,
            primer_nombre=primer_nombre,
            numero_identificacion=numero_identificacion,
            tipo_identificacion=tipo_identificacion,
            celular=celular,
            role='estudiante',
            estado='A'
        )

        return user_profile

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "user_id": instance.user.id,
            "primer_nombre": instance.primer_nombre,
            "numero_identificacion": instance.numero_identificacion,
            "tipo_identificacion": instance.tipo_identificacion,
            "celular": instance.celular,
            "nombre_completo": instance.nombre_completo,
            "username": instance.user.username
        }
        
class CursoSerializer(serializers.ModelSerializer):
    monitor = UserProfileSerializer(source="monitor.profile", read_only=True)
    # estudiantes = UserProfileBasicSerializer(source="estudiantes.profile", many=True, read_only=True)    
    estudiantes = serializers.SerializerMethodField()
    agregar_estudiantes = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="Lista de User IDs a agregar"
    )

    
    class Meta:
        model = Curso

        fields = ["id", "modulo", "estudiantes", "monitor", "estado", "fecha", "agregar_estudiantes"]

    def get_estudiantes(self, obj):
        return UserProfileBasicSerializer(
            [user.profile for user in obj.estudiantes.all()],
            many=True
        ).data

    def create(self, validated_data):
        user_ids = validated_data.pop("agregar_estudiantes", [])
        curso = Curso.objects.create(**validated_data)

        if user_ids:
            profiles = User.objects.filter(id__in=user_ids)
            curso.estudiantes.add(*profiles)

        return curso

    def update(self, instance, validated_data):
        user_ids = validated_data.pop("agregar_estudiantes", [])

        instance = super().update(instance, validated_data)

        if user_ids:
            profiles = User.objects.filter(id__in=user_ids)
            instance.estudiantes.add(*profiles)

        return instance
    
class CursoListSerializer(serializers.ModelSerializer):
    total_estudiantes = serializers.IntegerField(read_only=True)
    monitor = serializers.CharField(
        source='monitor.get_full_name',
        read_only=True
    )

    class Meta:
        model = Curso
        fields = [
            'id',
            'modulo',
            'estado',
            'fecha',
            'monitor',
            'total_estudiantes',
        ]
class AsistenciaSerializer(serializers.ModelSerializer):
    estudiante = serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = Asistencia
        fields = ["id", "estudiante", "estado", "fecha", "observaciones", "creado", "curso"]
        
        
    def get_estudiante(self, obj):
        user = UserProfile.objects.get(id=obj.estudiante.id)
        
        data = {
            "id": obj.estudiante.id,
            "nombre_completo": f"{user.primer_nombre} {user.segundo_nombre} {user.primer_apellido} {user.segundo_apellido}",
            "tipo_identificacion": user.tipo_identificacion,
            "numero_identificacion": user.numero_identificacion,
            "numero": user.celular,
        }
            
        return data
    

class AsistenciaBulkSerializer(serializers.Serializer):
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())
    fecha = serializers.DateField(default=timezone.now())
    asistencias = serializers.DictField(
        child=serializers.ChoiceField(choices=Asistencia.ESTADOS_ASISTENCIA)
    )
    observaciones = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        curso = validated_data['curso']
        fecha = validated_data['fecha']
        asistencias_data = validated_data['asistencias']
        observaciones_general = validated_data.get('observaciones', '')
        
        asistencias_creadas = []
        
        for estudiante_id, estado in asistencias_data.items():
            try:
                estudiante = UserProfile.objects.get(numero_identificacion=estudiante_id)
                
                asistencia, created = Asistencia.objects.update_or_create(
                    estudiante=estudiante,
                    curso=curso,
                    fecha=fecha,
                    defaults={
                        'estado': estado,
                        'observaciones': observaciones_general
                    }
                )
                
                asistencias_creadas.append(asistencia)
                
            except UserProfile.DoesNotExist:
                continue
            except Exception as e:
                continue
        
        return asistencias_creadas
    
class AsistenciaMetricasSerializer(serializers.Serializer):
    cursos_activos = serializers.IntegerField()
    total_estudiantes = serializers.IntegerField()
    total_estudiantes_activos = serializers.IntegerField()
    total_ausentes = serializers.IntegerField()
    modulo_mas_ausentes = serializers.CharField()
    id_modulo_mas_ausentes = serializers.CharField()
    total_ausentes_mes = serializers.IntegerField()
    estudiantes_con_bajas = serializers.IntegerField()
    last_updated = serializers.DateTimeField()
    
    
class MonitorSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.CharField(source='profile.nombre_completo')
    tipo_documento = serializers.CharField(source='profile.tipo_identificacion')
    numero_documento = serializers.CharField(source='profile.numero_identificacion')
    celular = serializers.CharField(source='profile.celular')
    estado = serializers.CharField(source='profile.estado')

    class Meta:
        model = User
        fields = [
            'id',
            'nombre_completo',
            'tipo_documento',
            'numero_documento',
            'celular',
            'estado',
        ]
        
class ChangeMonitorRoleSerializer(serializers.Serializer):
    pass

class EstudianteRiesgoSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    total_inasistencia = serializers.IntegerField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "nombre_completo",
            "tipo_identificacion",
            "numero_identificacion",
            "estado",
            "celular",
            "jornada",
            "total_inasistencia",
        ]

    def get_nombre_completo(self, obj):
        return obj.nombre_completo

    

class EstudianteAusenteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.CharField(source="estudiante.nombre_completo")
    tipo_documento = serializers.CharField(source="estudiante.tipo_identificacion")
    numero_documento = serializers.CharField(source="estudiante.numero_identificacion")
    celular = serializers.CharField(source="estudiante.celular")
    modulo = serializers.CharField(source="curso.modulo")
    jornada = serializers.CharField(source="estudiante.jornada")
    estado = serializers.CharField(source="estudiante.estado")
    total_inasistencia = serializers.IntegerField()

    class Meta:
        model = Asistencia
        fields = [
            "id",
            "nombre_completo",
            "tipo_documento",
            "numero_documento",
            "celular",
            "modulo",
            "jornada",
            "fecha",
            "estado",
            "total_inasistencia",
        ]

# class EstudianteAusenteSerializer(serializers.Serializer):
#     id = serializers.CharField()
#     nombre_completo = serializers.CharField()
#     tipo_documento = serializers.CharField()
#     numero_documento = serializers.CharField()
#     modulo = serializers.CharField()
#     jornada = serializers.CharField()
#     celular = serializers.CharField()
#     fecha = serializers.DateField()
#     estado = serializers.CharField()
#     total_inasistencia = serializers.IntegerField()

    
class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"}
    )

class CursoEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ["estado"]

class CrearMonitorSerializer(serializers.ModelSerializer):
    primer_nombre = serializers.CharField(max_length=50, required=True)
    numero_identificacion = serializers.CharField(max_length=20, required=True)
    tipo_identificacion = serializers.ChoiceField(choices=UserProfile.TIPOS_IDENTIFICACION, required=True)
    celular = serializers.CharField(max_length=15, required=False, allow_blank=True)

    class Meta:
        model = UserProfile
        fields = ['primer_nombre', 'numero_identificacion', 'tipo_identificacion', 'celular']

    def validate_numero_identificacion(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este número de identificación")
        if UserProfile.objects.filter(numero_identificacion=value).exists():
            raise serializers.ValidationError("Ya existe un perfil con este número de identificación")
        return value

    def create(self, validated_data):
        with transaction.atomic():
            primer_nombre = validated_data.pop('primer_nombre')
            numero_identificacion = validated_data.pop('numero_identificacion')
            tipo_identificacion = validated_data.pop('tipo_identificacion')
            celular = validated_data.pop('celular', '')

            user = User.objects.create_user(
                username=numero_identificacion,
                first_name=primer_nombre,
                password=numero_identificacion
            )

            user_profile = UserProfile.objects.create(
                user=user,
                primer_nombre=primer_nombre,
                numero_identificacion=numero_identificacion,
                tipo_identificacion=tipo_identificacion,
                celular=celular,
                role='monitor',
                estado='A'
            )
            return user_profile
