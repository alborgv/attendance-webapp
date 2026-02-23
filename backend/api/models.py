from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


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
        ('MN', 'Monitor')
    ]
    
    ESTADOS = [
        ('A', 'Activo'),
        ('I', 'Inactivo'),
        ('G', 'Graduado'),
        ('C', 'Cancelado'),
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
    
    tipo_identificacion = models.CharField(max_length=3, choices=TIPOS_IDENTIFICACION)
    numero_identificacion = models.CharField(max_length=100, null=True, blank=True)
    lugar_expedicion_documento = models.CharField(max_length=100, null=True, blank=True)

    # Información personal
    primer_nombre = models.CharField(max_length=50, null=True, blank=True)
    segundo_nombre = models.CharField(max_length=50, null=True, blank=True)
    primer_apellido = models.CharField(max_length=50, null=True, blank=True)
    segundo_apellido = models.CharField(max_length=50, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    lugar_nacimiento = models.CharField(max_length=100, null=True, blank=True)
    sexo = models.CharField(max_length=1, choices=SEXOS, null=True, blank=True)
    estrato = models.IntegerField(choices=ESTRATOS, null=True, blank=True)
    estado_civil = models.CharField(max_length=3, choices=ESTADOS_CIVILES, null=True, blank=True)
    tipo_sangre = models.CharField(max_length=3, choices=TIPOS_SANGRE, null=True, blank=True)
    edad = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        null=True,
        blank=True
    )

    # Contacto
    telefono = models.CharField(max_length=15, null=True, blank=True)
    celular = models.CharField(max_length=15, null=True, blank=True)
    correo_electronico = models.EmailField(null=True, blank=True)
    direccion = models.TextField(null=True, blank=True)
    pais = models.CharField(max_length=50, null=True, blank=True)
    lugar_residencia = models.CharField(max_length=100, null=True, blank=True)
    barrio = models.CharField(max_length=100, null=True, blank=True)

    # Académico
    sede = models.CharField(max_length=100, null=True, blank=True)
    jornada = models.CharField(max_length=50, null=True, blank=True)
    programa = models.CharField(max_length=100, null=True, blank=True)
    grupo = models.CharField(max_length=100, null=True, blank=True)
    periodo = models.CharField(max_length=100, null=True, blank=True)
    nivel = models.CharField(max_length=50, null=True, blank=True)
    nivel_formacion = models.CharField(max_length=100, null=True, blank=True)
    codigo_matricula = models.CharField(max_length=50, unique=True, null=True, blank=True)

    # Salud
    eps = models.CharField(max_length=100, null=True, blank=True)
    ars = models.CharField(max_length=100, null=True, blank=True)
    aseguradora = models.CharField(max_length=100, null=True, blank=True)
    grupo_sisben = models.CharField(max_length=50, null=True, blank=True)
    pertenece_regimen_contributivo = models.CharField(max_length=100, null=True, blank=True)

    # Información adicional
    ocupacion = models.CharField(max_length=100, null=True, blank=True)
    discapacidad = models.CharField(max_length=100, null=True, blank=True)
    medio_transporte = models.CharField(max_length=100, null=True, blank=True)
    multiculturalidad = models.CharField(max_length=100, null=True, blank=True)
    zona = models.CharField(max_length=1, choices=ZONAS, null=True, blank=True)

    # Matrícula
    estado = models.CharField(max_length=3, choices=ESTADOS)
    tipo_cancelacion = models.CharField(max_length=50, null=True, blank=True)
    fecha_matricula = models.DateTimeField(default=timezone.now, null=True, blank=True)
    formalizada = models.CharField(max_length=100, null=True, blank=True)
    condicion_matricula = models.CharField(max_length=100, null=True, blank=True)

    # Sistema
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuarios'

    def __str__(self):
        return f"Perfil de {self.user.username}"

    def save(self, *args, **kwargs):
        
        if self.fecha_nacimiento:
            today = timezone.now()
            self.edad = today.year - self.fecha_nacimiento.year - (
                (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )

        super().save(*args, **kwargs)
        
    def get_fullname(self):
        parts = [
            self.primer_nombre or '',
            self.segundo_nombre or '',
            self.primer_apellido or '',
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
    estudiantes = models.ManyToManyField(User, related_name="curso_estudiantes")
    monitor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='curso_monitor')
    estado = models.CharField(max_length=1, choices=ESTADOS_CURSO, default='A', blank=True)
    fecha = models.DateField(default=timezone.now)
    
    
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
    creado = models.DateField(auto_now_add=True)


    class Meta:
        verbose_name = 'Asistencias'
        verbose_name_plural = 'Asistencias'