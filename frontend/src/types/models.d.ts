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

  // JWT
  email: string;
  first_name: string;
  last_name: string;
  exp: number;
  iat: number;
  jti: string;

  // Identificación
  tipo_identificacion: TipoIdentificacion;
  numero_identificacion?: string | null;
  lugar_expedicion_documento?: string | null;

  // Información personal
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
  edad?: number | null;

  // Contacto
  telefono?: string | null;
  celular?: string | null;
  correo_electronico?: string | null;
  direccion?: string | null;
  pais?: string | null;
  lugar_residencia?: string | null;
  barrio?: string | null;

  // Académico
  sede?: string | null;
  jornada?: string | null;
  programa?: string | null;
  grupo?: string | null;
  periodo?: string | null;
  nivel?: string | null;
  nivel_formacion?: string | null;
  codigo_matricula?: string | null;

  // Salud
  eps?: string | null;
  ars?: string | null;
  aseguradora?: string | null;
  grupo_sisben?: string | null;
  pertenece_regimen_contributivo?: string | null;

  // Información adicional
  ocupacion?: string | null;
  discapacidad?: string | null;
  medio_transporte?: string | null;
  multiculturalidad?: string | null;
  zona?: ZoneOrEmpty;

  // Matrícula
  estado?: EstadoMatricula;
  tipo_cancelacion?: string | null;
  fecha_matricula?: string | null;
  formalizada?: string | null;
  condicion_matricula?: string | null;

  // Sistema
  ultima_actualizacion?: string | null;
}


interface MonitorProps {
  id?: number;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  celular: string;
  estado: 'A' | 'I';
}