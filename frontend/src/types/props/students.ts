import { AttendanceState, CourseItem } from "./attendance";

export interface StudentFilters {
    username?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
}

export type Student = {
    id: number;
    nombre_completo: string;
    tipo_identificacion?: string;
    numero_identificacion: string;
    numero: string;
    avatar?: string;
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
