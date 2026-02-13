import { CourseItem } from "../props/attendance";
import { Student } from "../../components/Students";

export interface CreateStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateStudent?: (primer_nombre: string, numero_identificacion: string, celular: string, tipo_identificacion?: string) => void;
}

export interface StudentSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectStudent: (student: Student) => void;
    course?: CourseItem;
}

export interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCourseCreated: (course: any) => void;
}

export interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
