import { ExcelColumn } from "@/context";
import { CourseItem } from "./props/attendance";
import { StudentFilters } from "../components/Students";

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
        handleUnauthorized: () => void;
        changeMonitorPassword: (userId: number, password: string) => Promise<boolean>;
        logoutUser: () => void;
        error: ErrorsState | null;
        loading: boolean;
    }

    interface PaginationParams {
        page?: number;
        pageSize?: number;
    }

    interface GetAllStudentsParams extends PaginationParams{
        username?: string;
        status?: string;
        jornada?: string;
    }
    
    interface GetAllCourseParams extends PaginationParams{
        status?: string;
        course?: string;
    }

    interface GetStudentAbsent extends PaginationParams{
        jornada?: string;
        username?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
    }

    interface GetStudentAlert extends PaginationParams{
        jornada?: string;
        username?: string;
        status?: string;
    }

    interface QueryContextType {
        selectedCourse: CourseItem | null;
        setSelectedCourse: (id: CourseItem) => void;

        getAllStudentsBasic: (
                params?: GetAllStudentsParams
            ) => Promise<PaginatedResponse<Student>>;
        createStudentBasic: (
            primer_nombre: string,
            numero_identificacion: string,
            celular: string,
            tipo_identificacion?: string ) => Promise<void>;

        getCourses: (filters?: CourseFiltersBD) => Promise<CourseItem[]>;
        getAttendance: (filters: AttendanceFilters | null) => Promise<AttendanceItem[]>;
        getAttendanceMetrics: () => Promise<AttendanceMetricsData>;
        createCourse: (courseData: {modulo: string, fecha: string, estudiantes: number[]}) => Promise<void>;
        addStudentCourse: (courseId: string, studentsId: number[]) => Promise<void>;
        createAttendance: (cursoId: string, asistenciasData: AttendanceData, fecha?: string, observaciones?: string) => Promise<void>;
        deactivateCourse: (courseId: string) => Promise<void>;
        getAllMonitor: () => Promise<Monitor>;
        createMonitor: (monitor: MonitorProps) => Promise<void>;
        addMonitor: (userId: number) => Promise<void>;
        deleteMonitor: (userId: number) => Promise<void>;
        StudentAlert: (params?: GetStudentAlert) => Promise<PaginatedResponse<StudentAlertProps>>;
        
        // getAllStudentsBasic: (
        //         params?: GetAllStudentsParams
        //     ) => Promise<PaginatedResponse<Student>>;
        StudentAbsent: (params?: GetStudentAbsent) => Promise<PaginatedResponse<StudentAbsentProps>>;

        getAllCourse: (params?: GetAllCourseParams) => Promise<PaginatedResponse<CourseItem[]>>;
        exportExcel: <T>(
            filename: string,
            columns: ExcelColumn<T>[],
            title: string,
            data: T[]) => Promise<any>;
        uploadExcel: (file: File) => Promise<any>
    }

}

export { }
