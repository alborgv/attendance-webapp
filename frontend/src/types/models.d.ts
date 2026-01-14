declare type Role = 'administrador' | 'profesor' | 'monitor' | 'estudiante';
declare type TipoIdentificacion = 'CC' | 'CE' | 'TI' | 'PAS';
declare type EstadoMatricula = 'ACT' | 'INA' | 'PEN';
declare type Sexo = 'M' | 'F' | 'O';
declare type Estrato = 1 | 2 | 3 | 4 | 5 | 6;
declare type EstadoCivil = 'SOL' | 'CAS' | 'DIV' | 'VIU' | 'UL';
declare type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
declare type Zona = 'U' | 'R';

declare interface EstudianteExtraProps {
    id: any;
    numero_identificacion: string;
    nombre_completo: string;
    celular: string;
}

declare interface UserProfileProps {
  user: number;
  role: Role;

  // jwt
  email: string;
  first_name: string;
  last_name: string;
  exp: number;
  iat: number;
  jti: string;

  // Info básica
  nombre_completo?: string | null;
  primer_nombre?: string | null;
  segundo_nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  fecha_nacimiento?: string | null;
  lugar_nacimiento?: string | null;
  sexo?: Sexo | '' | null;
  estrato?: Estrato | null;
  estado_civil?: EstadoCivil | '' | null;
  tipo_sangre?: TipoSangre | '' | null;

  // Identificación
  tipo_identificacion: TipoIdentificacion;
  numero_identificacion?: string | null;
  lugar_expedicion_documento?: string | null;

  // Contacto
  telefono?: string | null;
  celular?: string | null;
  direccion?: string | null;
  pais?: string | null;
  lugar_residencia?: string | null;
  barrio?: string | null;

  // Académica
  sede?: string | null;
  jornada?: string | null;
  programa?: string | null;
  grupo?: string | null;
  periodo?: string | null;
  nivel?: string | null;
  codigo_matricula?: string | null;
  nivel_formacion?: string | null;

  // Salud / aseguradoras
  eps?: string | null;
  ars?: string | null;
  aseguradora?: string | null;
  grupo_sisben?: string | null;

  // Adicional
  discapacidad?: boolean;
  medio_transporte?: string | null;
  multiculturalidad?: boolean;
  zona?: ZoneOrEmpty;
  ocupacion?: string | null;

  // Matrícula
  estado?: EstadoMatricula;
  tipo_cancelacion?: string | null;
  fecha_matricula?: string | null;
  formalizada?: boolean;
  condicion_matricula?: string | null;

  // Historial académico
  nivel_academico?: string | null;
  ultimo_ano?: number | null;
  ultimo_nivel_aprobado?: string | null;
  titulo_alcanzado?: string | null;
  graduado?: boolean;
  fecha_graduacion?: string | null;

  // Institución anterior
  institucion?: string | null;
  municipio_institucion?: string | null;
  nit_institucion?: string | null;
  telefono_institucion?: string | null;
  direccion_institucion?: string | null;
  email_institucion?: string | null;

  // Sistema
  ultima_actualizacion?: string | null;
  edad?: number | null;
  pertenece_regimen_contributivo?: boolean;
}

interface MonitorProps {
  id: number;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  estado: 'ACT' | 'INA';
}