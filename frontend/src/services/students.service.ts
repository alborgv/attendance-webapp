import { Student } from "@/components/Students";
import { PaginatedResponse } from ".";

export const createStudentsService = (http: {
    request: (path: string, options?: RequestInit) => Promise<Response>;
}) => ({

    async getAllStudentsBasic(params ?: {
        username?: string;
        page?: number;
        pageSize?: number;
        status?: string;
        jornada?: string;
    }): Promise<PaginatedResponse< Student >> {

        const queryParams = new URLSearchParams();

        if (params?.username && params.username.trim() !== "") {
            queryParams.append("username", params.username);
        }


        queryParams.append("estado", String(params?.status ?? ""));
        queryParams.append("jornada", String(params?.jornada ?? ""));
        queryParams.append("page", String(params?.page ?? 1));
        queryParams.append("page_size", String(params?.pageSize ?? 8));
            
        const query = queryParams.toString();
        const response = await http.request(`/api/users_basic/?${query}`);
        const data = await response.json();
        
        return {
            count: data.count,
            next: data.next,
            previous: data.previous,
            results: data.results.map((item: any) => ({
                id: item.id,
                nombre_completo: item.nombre_completo,
                tipo_identificacion: item.tipo_identificacion,
                numero_identificacion: item.numero_identificacion,
                celular: item.celular ?? "",
                jornada: item.jornada,
                estado: item.estado,
            })),
        };
    },

    async createStudentBasic(payload: {
        primer_nombre: string;
        numero_identificacion: string;
        celular: string;
        tipo_identificacion?: string;
    }) {
        const response = await http.request(
            "/api/users_basic/crear/",
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        return await response.json();
    },


        async StudentAlert(params?: {
            status?: string;
            jornada?: string;
            username?: string;
            page?: number;
            pageSize?: number;
        }): Promise<PaginatedResponse<Student>> {
            const queryParams = new URLSearchParams();

            if (params?.username && params.username.trim() !== "") {
                queryParams.append("username", params.username);
            }


            queryParams.append("estado", String(params?.status ?? ""));
            queryParams.append("jornada", String(params?.jornada ?? ""));
            queryParams.append("page", String(params?.page ?? 1));
            queryParams.append("page_size", String(params?.pageSize ?? 8));

            const response = await http.request(
                `/api/asistencia/ausencias/?${queryParams.toString()}`
            );

            return await response.json();
        },

        // async StudentAbsent() {
        //     const response = await http.request("/api/asistencia/ausencias/");
        //     const data = await response.json();
        //     return data;
        // }
    //     params ?: {
    //     username?: string;
    //     page?: number;
    //     pageSize?: number;
    //     status?: string;
    //     jornada?: string;
    // }): Promise<PaginatedResponse< Student >> {

        async StudentAbsent(params?: {
            startDate?: string;
            endDate?: string;
            status?: string;
            jornada?: string;
            username?: string;
            page?: number;
            pageSize?: number;
        }): Promise<PaginatedResponse< Student >> {

            const queryParams = new URLSearchParams();

            if (params?.username && params.username.trim() !== "") {
                queryParams.append("username", params.username);
            }


            queryParams.append("estado", String(params?.status ?? ""));
            queryParams.append("fecha_inicio", String(params?.startDate ?? ""));
            queryParams.append("fecha_fin", String(params?.endDate ?? ""));
            queryParams.append("jornada", String(params?.jornada ?? ""));
            queryParams.append("page", String(params?.page ?? 1));
            queryParams.append("page_size", String(params?.pageSize ?? 8));

            const response = await http.request(
                `/api/asistencia/ausencias/?${queryParams.toString()}`
            );

            return await response.json();
        }

});
