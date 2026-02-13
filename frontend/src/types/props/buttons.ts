import { CourseItem } from "./attendance";
import { Student } from "../../components/Students";

export interface AttendanceButtonProps {
    onSubmitAttendance?: () => void;
    isSubmitting?: boolean;
    onEditAttendance?: () => void;
    isEdit?: boolean;
    onAddStudent: (student: Student) => void;
    onCreateStudent: (primer_nombre: string, numero_identificacion: string, celular: string, tipo_identificacion?: string) => void;
    onDeactivateCourse: () => void;
    course: CourseItem;
    canSubmit?: boolean;
}


export interface OptionAttendanceButtonProps {
    type: "present" | "absent" | "leave";
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}