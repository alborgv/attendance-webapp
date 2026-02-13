export type StatusFilter = 'A' | 'I' | 'ALL';
export type ScheduleFilter =
    | ''
    | 'MAÑANA 7 - 9:30'
    | 'MAÑANA 10:15 - 12:45'
    | 'TARDE 1:30 - 4'
    | 'TARDE 4 - 6:30'
    | 'SABADO MAÑANA'
    | 'SABADO TARDE'
    | 'DOMINGO'
    | 'VIERNES MAÑANA'
    | 'VIERNES TARDE'
    | 'NOCHE';

export const STUDENT_ABSENT_PRESETS = [
    "TODAY",
    "YESTERDAY",
    "LAST_7_DAYS",
    "LAST_30_DAYS",
    "THIS_MONTH",
    "LAST_MONTH",
    "CUSTOM",
] as const;

export type StudentAbsentPreset =
    typeof STUDENT_ABSENT_PRESETS[number];

export interface FilterProps<T> {
    value: T,
    onChange: (value: T) => void;
}

export interface CourseFilters {
    course?: string;
    status?: StatusFilter;
    jornada?: ScheduleFilter;
    monitorId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
}

export interface StudentAlertFilter extends PaginationParams {
    jornada?: ScheduleFilter;
    status?: StatusFilter;
    username?: string;
}

export interface StudentAbsentFilter extends PaginationParams {
    jornada?: ScheduleFilter;
    status?: StatusFilter;
    username?: string;
    preset?: StudentAbsentPreset;
    startDate?: string;
    endDate?: string;
}

export function isStudentAbsentPreset(
    value: string | null
): value is StudentAbsentPreset {
    return (
        value !== null &&
        STUDENT_ABSENT_PRESETS.includes(value as StudentAbsentPreset)
    );
}