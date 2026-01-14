from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import UserProfile, Curso, Asistencia


class TokenSerializer(TokenObtainPairSerializer):
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
            'id', 'user', 'role', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 
            'segundo_apellido', 'fecha_nacimiento', 'lugar_nacimiento', 'sexo', 'estrato', 
            'estado_civil', 'tipo_sangre', 'tipo_identificacion', 'numero_identificacion', 
            'lugar_expedicion_documento', 'telefono', 'celular', 'direccion', 'pais', 
            'lugar_residencia', 'barrio', 'sede', 'jornada', 'programa', 'grupo', 'periodo', 
            'nivel', 'codigo_matricula', 'nivel_formacion', 'eps', 'ars', 'aseguradora', 
            'grupo_sisben', 'discapacidad', 'medio_transporte', 'multiculturalidad', 
            'zona', 'ocupacion', 'estado', 'tipo_cancelacion', 'fecha_matricula', 
            'formalizada', 'condicion_matricula', 'nivel_academico', 'ultimo_ano', 
            'ultimo_nivel_aprobado', 'titulo_alcanzado', 'graduado', 'fecha_graduacion',
            'institucion', 'municipio_institucion', 'nit_institucion', 'telefono_institucion',
            'direccion_institucion', 'email_institucion', 'ultima_actualizacion', 
            'edad', 'pertenece_regimen_contributivo', 'nombre_completo']
        
class UserProfileBasicSerializer(serializers.ModelSerializer):    
    class Meta:
        model = UserProfile
        fields = ['id', 'nombre_completo', 'tipo_identificacion', 'numero_identificacion', 'celular']
        
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
            estado='ACT'
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
    monitor = UserProfileSerializer(read_only=True)
    estudiantes = UserProfileBasicSerializer(many=True, read_only=True)
    agregar_estudiantes = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(),
        many=True,
        write_only=True,
        required=False,
        help_text="Lista de IDs de estudiantes a agregar (no reemplaza los existentes)"
    )
    
    class Meta:
        model = Curso

        fields = ["id", "modulo", "estudiantes", "monitor", "estado", "fecha", "agregar_estudiantes"]

    def create(self, validated_data):
        estudiantes_ids = validated_data.pop('agregar_estudiantes', [])
        curso = Curso.objects.create(**validated_data)
        if estudiantes_ids:
            curso.estudiantes.add(*estudiantes_ids)
        return curso

    def update(self, instance, validated_data):
        estudiantes_ids = validated_data.pop('agregar_estudiantes', None)

        instance = super().update(instance, validated_data)

        if estudiantes_ids:
            instance.estudiantes.add(*estudiantes_ids)

        return instance
    
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
    fecha = serializers.DateField(default=timezone.now().date)
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
    estado = serializers.CharField(source='profile.estado')

    class Meta:
        model = User
        fields = [
            'id',
            'nombre_completo',
            'tipo_documento',
            'numero_documento',
            'estado',
        ]
        
class ChangeMonitorRoleSerializer(serializers.Serializer):
    pass