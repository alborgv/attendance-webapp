import { StudentFilters } from "./props/students";

declare global {
    interface ChildrenProps {
        children: ReactNode;
        fallback?: React.ReactNode;
    }

    interface LoginProps {
        username: string;
        password: string;
    }

    interface InputProps {
        id: string;
        label: string;
        type: string;
        placeholder: string;
    }

    interface LoginFormProps {
        errors: ErrorsState;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }

    interface ErrorsState {
        username?: string;
        password?: string;
        notAuth?: string;
        [key: string]: string | undefined;
    }

    interface DecodedToken {
        user_id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
        role: string;
        primer_nombre?: string;
        segundo_nombre?: string;
        primer_apellido?: string;
        segundo_apellido?: string;
        numero_identificacion?: string;
        exp: number;
        iat: number;
    }

    interface AuthTokens {
        access: string;
        refresh: string;
        user?: {
            id: number;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
            profile: {
                role: string;
                primer_nombre: string;
                segundo_nombre: string;
                primer_apellido: string;
                segundo_apellido: string;
                numero_identificacion: string;
            };
        };
    }
    
    interface AuthContextType {
        user: DecodedToken | null;
        authTokens: AuthTokens | null;
        loginUser: (formData: LoginProps) => Promise<boolean>;
        logoutUser: () => void;
        error: ErrorsState | null;
        loading: boolean;
    }

    interface QueryContextType {
        selectedCourse: CourseItem | null;
        setSelectedCourse: (id: CourseItem) => void;
        getAllStudentsBasic: (search?: String) => Promise<Student[]>;
        getCourseById: (curso_id: String) => Promise<CourseItem>;
        getCourseByStatus: (status: String) => Promise<CourseItem>;
        getCourseByMonitor: (username: String) => Promise<CourseItem[]>;
        getAttendance: (filters: AttendanceFilters | null) => Promise<AttendanceItem[]>;
        getAttendanceMetrics: () => Promise<AttendanceMetricsData>;
        createCourse: (courseData: {modulo: string, fecha: string, estudiantes: number[]}) => Promise<void>;
        addStudentCourse: (courseId: string, studentsId: number[]) => Promise<void>;
        createAttendance: (cursoId: string, asistenciasData: AttendanceData, fecha?: string, observaciones?: string) => Promise<void>;
        createStudentBasic: (primer_nombre: string, numero_identificacion: string, celular: string, tipo_identificacion?: string) => Promise<void>;
        deactivateCourse: (courseId: string, estado: boolean) => Promise<void>;
        getAllMonitor: () => Promise<Monitor>;
        addMonitor: (userId: number) => Promise<void>;
        deleteMonitor: (userId: number) => Promise<void>;
    }

}

export { }
