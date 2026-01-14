import { Students } from "../models/user";
import { Student } from "./students";

export type AttendanceState = "P" | "A" | "J" | "none";

export interface AttendanceHeaderProps {
    selectedCourse: CourseItem;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    isEdit?: boolean;
}
export interface AttendanceData {
    [studentId: string]: string;
}

export interface AttendanceItem {
    id: string;
    curso: string;
    estado: string;
    estudiante: Student;
    fecha: string;
    observaciones: string;
}
export interface CourseItem {
    id: string;
    modulo: string;
    estado: string;
    estudiantes: Students[];
    fecha: string;
    monitor: UserProfileProps;
}

export interface AttendanceFilters {
    fecha?: string;
    estado?: 'P' | 'A' | 'J' | '';
    curso?: string;
}

export interface AttendanceStatsProps {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    leaveCount: number;
}

export interface AttendanceMetricsData {
  cursos_activos: number;
  total_estudiantes: number;
  total_ausentes: number;
  modulo_mas_ausentes: string;
  total_modulo_mas_ausentes: number;
  id_modulo_mas_ausentes: number;
  total_ausentes_mes: number;
  estudiantes_con_bajas: number;
  last_updated: string;
}