export const createMonitorService = (http: {
    request: (path: string, options?: RequestInit) => Promise<Response>;
}) => ({
    
    async getAllMonitor() {
        const response = await http.request("/api/monitores/");
        return await response.json();
    },

    async createMonitor(monitor: MonitorProps) {
        const response = await http.request("/api/monitores/crear/", {
            method: "POST",
            body: JSON.stringify({
                primer_nombre: monitor.nombre_completo,
                tipo_identificacion: "MN",
                numero_identificacion: monitor.numero_documento,
                celular: monitor.celular,
                estado: "A"

            }),
        });

        return await response.json();
    },
    
    async addMonitor(userId: number) {
        const response = await http.request(`/api/monitores/${userId}/role/`, {
            method: "PATCH",
            body: JSON.stringify({
                "role": "monitor"
            })
        });
        return await response.json();
    },
    
    async deleteMonitor(userId: number) {
        const response = await http.request(`/api/monitores/${userId}/role/`, {
            method: "PATCH",
            body: JSON.stringify({
                "role": "estudiante"
            })
        });
        return await response.json();
    }


})