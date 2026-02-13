import { AttendanceData, AttendanceFilters } from "@/types/props/attendance";

export const createAttendanceService = (http: {
    request: (path: string, options?: RequestInit) => Promise<Response>;
}) => ({


    async createAttendance (cursoId: string, asistenciasData: AttendanceData, fecha?: string, observaciones?: string) {
        const response = await http.request("/api/asistencia/crear/", {
            method: "POST",
            body: JSON.stringify({
                curso: cursoId,
                fecha: fecha || new Date().toISOString().split('T')[0],
                asistencias: asistenciasData,
                observaciones: observaciones || ''
            }),
        });

        return await response.json();
    },

    async getAttendance(filters: AttendanceFilters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.fecha) queryParams.append('fecha', filters.fecha);
        if (filters.estado) queryParams.append('estado', filters.estado);
        if (filters.curso) queryParams.append('curso', filters.curso);

        const queryString = queryParams.toString();
        const url = queryString
            ? `/api/asistencia/?${queryString}`
            : `/api/asistencia/`;

        const response = await http.request(url);

        const data = await response.json();
        return data;
    },

    async getAttendanceMetrics() {
        const response = await http.request(`/api/asistencia/metricas`);
        return await response.json();
    }
})