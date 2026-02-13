import { ExcelColumn } from "@/context";

export const createExcelService = (http: {
    request: (path: string, options?: RequestInit) => Promise<Response>;
}) => ({
    async exportExcel<T>(
        filename: string,
        columns: ExcelColumn<T>[],
        title: string,
        data: T[]
    ): Promise<void> {
        const response = await http.request("/api/excel/export/", {
            method: "POST",
            body: JSON.stringify({
                filename,
                columns,
                data,
                title,
            }),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.xlsx`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
    },

    async uploadExcel(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await http.request("/api/excel/upload/", {
            method: "POST",
            body: formData,
        });

        return response.json();
    },
});
