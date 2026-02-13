import { AttendanceState, CourseItem } from "../../types/props/attendance";
import { ScheduleFilter, StatusFilter } from "../filters";

export interface StudentFilters {
    username?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    status?: StatusFilter;
    jornada?: ScheduleFilter;
}

export type Student = {
    id: number;
    nombre_completo: string;
    tipo_identificacion?: string;
    numero_identificacion: string;
    celular: string;
    jornada: string;
    estado?: string;
};

export interface StudentRowProps {
    student: Student;
    attendanceState: AttendanceState;
    onAttendanceChange: (documentId: string, state: AttendanceState) => void;
    onEditAttendance: (isEdit?: boolean) => void;
    isEdit?: boolean;
}

export interface StudentListProps {
    course: CourseItem;
    attendance: Record<string, AttendanceState>;
    onAttendanceChange: (documentId: string, state: AttendanceState) => void;
    onEditAttendance: (isEdit?: boolean) => void;
    isEdit?: boolean;
}

export interface StudentAlertProps {
  id: number;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  estado: string;
  celular: string;
  jornada: string;
  total_inasistencia: number;
}

export interface StudentAbsentProps {
  id: number;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  modulo: string;
  jornada: string;
  fecha: string;
  celular: string;
  estado: string;
  total_inasistencia: number;
}