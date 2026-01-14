import { AttendanceData, AttendanceFilters, CourseItem } from '@/types/props/attendance';
import { Student } from '@/types/props/students';
import { useAuth } from "@/context/AuthContext";
import React, { createContext, useContext, useState } from 'react';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCourse, setSelectedCourse] = useState<CourseItem>();

    const { authTokens } = useAuth();
    // const [loading, setLoading] = useState<boolean>(false);
    // const navigate = useNavigate();

    const urlBackend = import.meta.env.VITE_API_URL;

    const getAllStudentsBasic = async (search?: String) => {

        const queryString = search ? `?search=${search}` : "";

        const response = await fetch(`${urlBackend}/api/users_basic/${queryString}`);
        const data = await response.json();
        const mapped: Student[] = data.map((item: any) => ({
            id: item.id,
            nombre_completo: item.nombre_completo,
            tipo_identificacion: item.tipo_identificacion,
            numero_identificacion: item.numero_identificacion,
            numero: item.celular ?? "",
            avatar: undefined,
        }));
        return mapped;
    };
    const createStudentBasic = async (primer_nombre: string, numero_identificacion: string, celular: string, tipo_identificacion?: string) => {

        if (!authTokens) return;

        const accessToken = authTokens.access;

        const response = await fetch(`${urlBackend}/api/users_basic/crear/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                primer_nombre: primer_nombre,
                numero_identificacion: numero_identificacion,
                celular: celular,
                tipo_identificacion: tipo_identificacion || "EX",
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Error al crear estudiante");
        }

        return await response.json();
    }

    const createCourse = async (courseData: { modulo: string; fecha: string; estudiantes: number[]; }) => {
        if (!authTokens) return;

        const accessToken = authTokens.access;

        const response = await fetch(`${urlBackend}/api/curso/crear/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                modulo: courseData.modulo,
                fecha: courseData.fecha,
                agregar_estudiantes: courseData.estudiantes,
                estado: "A"
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.message || "Error al crear el curso");
        }

        return await response.json();
    };

    const addStudentCourse = async (courseId: string, studentsId: number[]) => {

        if (!authTokens) return;

        const accessToken = authTokens.access;

        const response = await fetch(`${urlBackend}/api/curso/${courseId}/agregar_estudiante/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                agregar_estudiantes: studentsId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Error al actualizar el curso");
        }

        return await response.json();
    };


    const createAttendance = async (cursoId: string, asistenciasData: AttendanceData, fecha?: string, observaciones?: string) => {
        if (!authTokens) return;

        const payload = {
            curso: cursoId,
            fecha: fecha || new Date().toISOString().split('T')[0],
            asistencias: asistenciasData,
            observaciones: observaciones || ''
        };

        if (!authTokens) return;

        const accessToken = authTokens.access;

        const response = await fetch(`${urlBackend}/api/asistencia/crear/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.detail || "Error al crear las asistencias");
        }

        return await response.json();
    };

    const getCourseById = async (curso_id: String) => {
        const response = await fetch(`${urlBackend}/api/curso/?curso_id=${curso_id}`);
        const data = await response.json();

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    };

    const getCourseByMonitor = async (username: String) => {
        const response = await fetch(`${urlBackend}/api/curso/?monitor_username=${username}`);
        const data = await response.json();
        return data;
    };
    
    const getCourseByStatus = async (status: String) => {
        const response = await fetch(`${urlBackend}/api/curso/?estado=${status}`);
        const data = await response.json();
        return data;
    };
    
    const getAttendance = async (filters: AttendanceFilters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.fecha) queryParams.append('fecha', filters.fecha);
        if (filters.estado) queryParams.append('estado', filters.estado);
        if (filters.curso) queryParams.append('curso', filters.curso);

        const queryString = queryParams.toString();
        const url = queryString
            ? `${urlBackend}/api/asistencia/?${queryString}`
            : `${urlBackend}/api/asistencia/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    };

    const getAttendanceMetrics = async () => {
        const response = await fetch(`${urlBackend}/api/asistencia/metricas`);
        const data = await response.json();
        return data;
    };

    const deactivateCourse = async (courseId: string, estado: boolean) => {
        try {
            const response = await fetch(`/api/curso/${courseId}/desactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado }),
            });

            if (!response.ok) throw new Error('Error al desactivar el curso');

            return await response.json();
        } catch (error) {
            console.error('Error desactivando curso:', error);
            throw error;
        }
    };

    const getAllMonitor = async () => {
        try {
            const response =  await fetch(`${urlBackend}/api/monitores/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error consiguiente monitores:', error);
            throw error;
        }
    }
    const addMonitor = async (userId: number) => {
        if (!authTokens) return;

        const accessToken = authTokens.access;

        try {
            const response =  await fetch(`${urlBackend}/api/users/${userId}/agregar_monitor/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al agregar monitor:', error);
            throw error;
        }
    }
    
    const deleteMonitor = async (userId: number) => {
        if (!authTokens) return;

        const accessToken = authTokens.access;

        try {
            const response =  await fetch(`${urlBackend}/api/users/${userId}/eliminar_monitor/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al eliminar monitor:', error);
            throw error;
        }
    }

    return (
        <QueryContext.Provider value={{
            selectedCourse,
            setSelectedCourse,
            getAllStudentsBasic,
            getCourseById,
            getCourseByStatus,
            getCourseByMonitor,
            getAttendance,
            getAttendanceMetrics,
            createCourse,
            addStudentCourse,
            createAttendance,
            createStudentBasic,
            deactivateCourse,
            getAllMonitor,
            addMonitor,
            deleteMonitor,
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