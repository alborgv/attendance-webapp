import { CourseFiltersBD, PaginatedResponse } from ".";
import { CourseItem } from "@/types/props/attendance";

export const createCourseService = (http: {
    request: (path: string, options?: RequestInit) => Promise<Response>;
}) => ({
    
    async createCourse(courseData: { modulo: string; fecha: string; estudiantes: number[]; }) {
        const response = await http.request("/api/curso/crear/", {
            method: "POST",
            body: JSON.stringify({
                modulo: courseData.modulo,
                fecha: courseData.fecha,
                agregar_estudiantes: courseData.estudiantes,
                estado: "A"
            }),
        });

        return await response.json();
    },

    async addStudentCourse(courseId: string, studentsId: number[]) {

        const response = await http.request(`/api/curso/${courseId}/agregar_estudiante/`, {
            method: "PATCH",
            body: JSON.stringify({
                agregar_estudiantes: studentsId,
            }),
        });

        return await response.json();
    },
    
    async getCourses(filters: CourseFiltersBD = {}): Promise<CourseItem[]> {
        const params = new URLSearchParams();
        
        if (filters.curso_id) params.append("curso_id", filters.curso_id);
        if (filters.monitor_username) params.append("monitor_username", filters.monitor_username);
        if (filters.estado) params.append("estado", filters.estado);

        const query = params.toString();
        const path = query ? `/api/curso/?${query}` : `/api/curso/`;
        
        const response = await http.request(path);
        return await response.json();
    },

    
    async deactivateCourse(courseId: string) {
        
        const response = await http.request(`/api/curso/${courseId}/estado/`, {
            method: 'PATCH',
            body: JSON.stringify({
                estado: "I"
            })
        });

        return await response.json();
        
    },

    
    async getAllCourse(params ?:{
        status?: string;
        course?: string;
        page?: number;
        pageSize?: number;
    }): Promise<PaginatedResponse<CourseItem>> {

        const queryParams = new URLSearchParams();
        
        if (params?.course && params.course.trim() !== "") {
            queryParams.append("modulo", params.course);
        }
        
        queryParams.append("estado", String(params?.status ?? ""));
        queryParams.append("page", String(params?.page ?? 1));
        queryParams.append("page_size", String(params?.pageSize ?? 8));
        const query = queryParams.toString();

        const response = await http.request(`/api/curso/lista/?${query}`);
        return await response.json();
    }
});
