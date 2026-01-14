from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.exceptions import ValidationError


class UserProfile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', unique=True)
    
    ROLE_CHOICES = [
        ('administrador', 'Administrador'),
        ('profesor', 'Profesor'),
        ('monitor', 'Monitor'),
        ('estudiante', 'Estudiante'),
    ]
    
    TIPOS_IDENTIFICACION = [
        ('CC', 'Cédula de Ciudadanía'),
        ('CE', 'Cédula de Extranjería'),
        ('TI', 'Tarjeta de Identidad'),
        ('PAS', 'Pasaporte'),
        ('EX', 'Estudiante Extra'),
    ]
    
    ESTADOS = [
        ('ACT', 'Activo'),
        ('INA', 'Inactivo'),
        ('PEN', 'Pendiente'),
    ]
    
    SEXOS = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    ESTRATOS = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
        (6, '6'),
    ]
    
    ESTADOS_CIVILES = [
        ('SOL', 'Soltero/a'),
        ('CAS', 'Casado/a'),
        ('DIV', 'Divorciado/a'),
        ('VIU', 'Viudo/a'),
        ('UL', 'Unión Libre'),
    ]
    
    TIPOS_SANGRE = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    
    ZONAS = [
        ('U', 'Urbana'),
        ('R', 'Rural'),
    ]

    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='estudiante'
    )
    
    # Info basica
    primer_nombre = models.CharField(max_length=50, blank=True)
    segundo_nombre = models.CharField(max_length=50, blank=True)
    primer_apellido = models.CharField(max_length=50, blank=True)
    segundo_apellido = models.CharField(max_length=50, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    lugar_nacimiento = models.CharField(max_length=100, blank=True)
    sexo = models.CharField(max_length=1, choices=SEXOS, blank=True)
    estrato = models.IntegerField(choices=ESTRATOS, null=True, blank=True)
    estado_civil = models.CharField(max_length=3, choices=ESTADOS_CIVILES, blank=True)
    tipo_sangre = models.CharField(max_length=3, choices=TIPOS_SANGRE, blank=True)

    # Identificacion
    tipo_identificacion = models.CharField(max_length=3, choices=TIPOS_IDENTIFICACION)
    numero_identificacion = models.CharField(max_length=20, null=True, blank=True)
    lugar_expedicion_documento = models.CharField(max_length=100, null=True, blank=True)
    
    # Informacion de contacto
    telefono = models.CharField(max_length=15, blank=True)
    celular = models.CharField(max_length=15, blank=True)
    direccion = models.TextField(blank=True)
    pais = models.CharField(max_length=50, blank=True)
    lugar_residencia = models.CharField(max_length=100, blank=True)
    barrio = models.CharField(max_length=100, blank=True)
    
    # Informacion academica
    sede = models.CharField(max_length=100, blank=True)
    jornada = models.CharField(max_length=50, blank=True)
    programa = models.CharField(max_length=100, blank=True)
    grupo = models.CharField(max_length=20, blank=True)
    periodo = models.CharField(max_length=20, blank=True)
    nivel = models.CharField(max_length=50, blank=True)
    codigo_matricula = models.CharField(max_length=50, unique=True, blank=True, null=True)
    nivel_formacion = models.CharField(max_length=100, blank=True)
    
    # Salud
    eps = models.CharField(max_length=100, blank=True)
    ars = models.CharField(max_length=100, blank=True)
    aseguradora = models.CharField(max_length=100, blank=True)
    grupo_sisben = models.CharField(max_length=50, blank=True)
    
    # Informacion adicional
    discapacidad = models.BooleanField(default=False)
    medio_transporte = models.CharField(max_length=100, blank=True)
    multiculturalidad = models.BooleanField(default=False)
    zona = models.CharField(max_length=1, choices=ZONAS, blank=True)
    ocupacion = models.CharField(max_length=100, blank=True)
    
    # Matricula
    estado = models.CharField(max_length=3, choices=ESTADOS, default='PEN')
    tipo_cancelacion = models.CharField(max_length=50, blank=True)
    fecha_matricula = models.DateTimeField(default=timezone.now)
    formalizada = models.BooleanField(default=False)
    condicion_matricula = models.CharField(max_length=100, blank=True)
    
    # Historial academico
    nivel_academico = models.CharField(max_length=100, blank=True)
    ultimo_ano = models.PositiveIntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(2100)],
        null=True, blank=True
    )
    ultimo_nivel_aprobado = models.CharField(max_length=100, blank=True)
    titulo_alcanzado = models.CharField(max_length=100, blank=True)
    graduado = models.BooleanField(default=False)
    fecha_graduacion = models.DateField(null=True, blank=True)
    
    # Institucion anterior
    institucion = models.CharField(max_length=200, blank=True)
    municipio_institucion = models.CharField(max_length=100, blank=True)
    nit_institucion = models.CharField(max_length=20, blank=True)
    telefono_institucion = models.CharField(max_length=15, blank=True)
    direccion_institucion = models.TextField(blank=True)
    email_institucion = models.EmailField(blank=True)
    
    # Sistema
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    edad = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        null=True, blank=True
    )
    pertenece_regimen_contributivo = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuarios'

    def __str__(self):
        return f"Perfil de {self.user.username}"

    def save(self, *args, **kwargs):
        
        if self.fecha_nacimiento:
            today = timezone.now().date()
            self.edad = today.year - self.fecha_nacimiento.year - (
                (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )

        super().save(*args, **kwargs)
        
    def get_fullname(self):
        parts = [
            self.primer_nombre,
            self.segundo_nombre or '',
            self.primer_apellido,
            self.segundo_apellido or ''
        ]
        full_name = ' '.join(part.strip() for part in parts if part.strip())
        return full_name
    
    @property
    def nombre_completo(self):
        return self.get_fullname()

    def is_admin(self):
        return self.role == 'administrador'
    
    def is_profesor(self):
        return self.role == 'profesor'
    
    def is_monitor(self):
        return self.role == 'monitor'
    
    def is_estudiante(self):
        return self.role == 'estudiante'
        

class Curso(models.Model):
    ESTADOS_CURSO = [
        ('A', 'Activo'),
        ('I', 'Inactivo')
    ]
    
    modulo = models.CharField(max_length=255, blank=True)
    estudiantes = models.ManyToManyField(UserProfile, related_name="curso_estudiantes")
    monitor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='curso_monitor')
    estado = models.CharField(max_length=1, choices=ESTADOS_CURSO, default='A', blank=True)
    fecha = models.DateTimeField(default=timezone.now)
    
    
    def __str__(self):
        return self.modulo
    
    class Meta:
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'
        
class Asistencia(models.Model):
    ESTADOS_ASISTENCIA = [
        ('P', 'Presente'),
        ('A', 'Ausente'),
        ('J', 'Justificado'),
    ]
    
    estudiante = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='asistencias', blank=True, null=True
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name='asistencias'
    )
    estado = models.CharField(max_length=1, choices=ESTADOS_ASISTENCIA, default='P', blank=True)
    fecha = models.DateField(default=timezone.now)
    observaciones = models.TextField(blank=True)
    creado = models.DateTimeField(default=timezone.now)


    class Meta:
        verbose_name = 'Asistencias'
        verbose_name_plural = 'Asistencias'