import { Student, StudentFilters } from "@/components/students";

export function applyStudentFilters(data: Student[], filters: StudentFilters) {
    
    
    return data.filter(student => {
        let isValid = true;
        if (filters.status && filters.status !== 'ALL') {
            isValid = isValid && student.estado === filters.status;
        }

        if (filters.jornada && filters.jornada !== 'ALL') {
            isValid = isValid && student.jornada === filters.jornada;
        }

        return isValid;
    });

}
