import { AttendanceData, AttendanceFilters, CourseItem } from '@/types/props/attendance';
import { useAuth } from "@/context/AuthContext";
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ExcelColumn } from '.';
import { createStudentsService } from '@/services/students.service';
import { createHttpClient } from '@/services/http';
import { createCourseService } from '@/services/course.service';
import { CourseFiltersBD } from '@/services';
import { createMonitorService } from '@/services/monitor.service';
import { createAttendanceService } from '@/services/attendance.service';
import { createExcelService } from '@/services/excel.service';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

    const { authTokens, handleUnauthorized } = useAuth();
    // const [loading, setLoading] = useState<boolean>(false);
    // const navigate = useNavigate();

    const urlBackend = import.meta.env.VITE_API_URL;

    const services = useMemo(() => {
        if (!authTokens) return null;
        const http = createHttpClient({
            apiUrl: urlBackend,
            tokens: authTokens,
            onUnauthorized: handleUnauthorized
        });
        return {
            students: createStudentsService(http),
            course: createCourseService(http),
            monitor: createMonitorService(http),
            attendance: createAttendanceService(http),
            excel: createExcelService(http),
        };
    }, [authTokens, urlBackend]);

    const getAllStudentsBasic = (params?: {
            username?: string;
            page?: number;
            pageSize?: number;
        }) => {
        if (!services) return Promise.resolve([]);
        return services.students.getAllStudentsBasic(params);
    };

    const createStudentBasic = (
        primer_nombre: string,
        numero_identificacion: string,
        celular: string,
        tipo_identificacion?: string
    ) => {
        if (!services) return Promise.reject("Service not ready");

        return services.students.createStudentBasic({
            primer_nombre,
            numero_identificacion,
            celular,
            tipo_identificacion,
        });
    };

    const StudentAlert = (params?: {
        jornada?: string;
        username?: string;
        page?: number;
        pageSize?: number;
    }) => {
        if (!services) return Promise.resolve([]);
        return services.students.StudentAlert(params);
    };
    
    const StudentAbsent = (params?: {
        startDate?: string;
        endDate?: string;
        jornada?: string;
        username?: string;
        page?: number;
        pageSize?: number;
    }) => {
        if (!services) return Promise.resolve([]);
        return services.students.StudentAbsent(params);
    };


    const createCourse = (courseData: { modulo: string; fecha: string; estudiantes: number[]; }) => {
        if (!services) return Promise.resolve([]);
        return services.course.createCourse(courseData);
    }

    const addStudentCourse = (courseId: string, studentsId: number[]) => {
        if (!services) return Promise.resolve([]);
        return services.course.addStudentCourse(courseId, studentsId);
    };

    const getCourses = (filters: CourseFiltersBD = {}) => {
        if (!services) return Promise.resolve([]);
        return services.course.getCourses(filters);
    };

    const getAllCourse = async (params?: {
        status?: string;
        course?: string;
        page?: number;
        pageSize?: number;
    }) => {
        if (!services) return Promise.resolve(null);
        return services.course.getAllCourse(params);
    };


    const deactivateCourse = (courseId: string) => {
        if (!services) return Promise.resolve([]);
        return services.course.deactivateCourse(courseId);
    };

    const getAllMonitor = () => {
        if (!services) return Promise.resolve([]);
        return services.monitor.getAllMonitor();
    }
    const createMonitor = (monitor: MonitorProps) => {
        if (!services) return Promise.resolve([]);
        return services.monitor.createMonitor(monitor);
    }
    const addMonitor = (userId: number) => {
        if (!services) return Promise.resolve([]);
        return services.monitor.addMonitor(userId);
    }
    const deleteMonitor = (userId: number) => {
        if (!services) return Promise.resolve([]);
        return services.monitor.deleteMonitor(userId);
    }
    const getAttendance = (filters: AttendanceFilters) => {
        if (!services) return Promise.resolve([]);
        return services.attendance.getAttendance(filters);
    }
    const getAttendanceMetrics = () => {
        if (!services) return Promise.resolve([]);
        return services.attendance.getAttendanceMetrics();
    }
    const createAttendance = (cursoId: string, asistenciasData: AttendanceData, fecha?: string, observaciones?: string) => {
        if (!services) return Promise.resolve([]);
        return services.attendance.createAttendance(cursoId, asistenciasData, fecha, observaciones);
    }

    const exportExcel = <T,>(
        filename: string,
        columns: ExcelColumn<T>[],
        title: string,
        data: T[]
    ) => {
        if (!services) return Promise.resolve([]);
        return services.excel.exportExcel(filename, columns, title, data);
    };

    const uploadExcel = (file: File) => {
        if (!services) return Promise.resolve([]);
        return services.excel.uploadExcel(file);
    };

    return (
        <QueryContext.Provider value={{
            selectedCourse,
            setSelectedCourse,

            getAllStudentsBasic,
            createStudentBasic,
            StudentAlert,
            StudentAbsent,
            getCourses,
            getAttendance,
            getAttendanceMetrics,
            createCourse,
            addStudentCourse,
            createAttendance,
            deactivateCourse,
            getAllMonitor,
            createMonitor,
            addMonitor,
            deleteMonitor,
            getAllCourse,
            exportExcel,
            uploadExcel
        }}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQuery = () => {
    const context = useContext(QueryContext);
    if (context === undefined) {
        throw new Error('useQuery must be used within an QueryProvider');
    }
    return context;
};