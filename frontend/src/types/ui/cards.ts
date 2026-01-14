import { CourseItem } from "../props/attendance";
import { ReactNode } from "react";

export interface CourseCardProps {
    course: CourseItem;
    onContinue: (course: CourseItem) => void;
    index?: number;
}
// cursos activos
// total de estudiantes
// inasistencias de hoy
// inasistencias del mes
// modulo con mas inasistencia
// estudiantes en riesgo (mass de 3 faltas en el mes)
export interface MetricsCardProps {
    title: string;
    icon: ReactNode;
    value: any;
    url?: string;
}