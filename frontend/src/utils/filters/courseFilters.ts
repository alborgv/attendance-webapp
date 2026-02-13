import { CourseFilters } from "@/components/filters";
import { CourseItem } from "@/types/props/attendance";

export function applyCourseFilters(data: CourseItem[], filters: CourseFilters) {
    return data.filter(course => {
        if (filters.status && course.estado !== filters.status) return false;
        // if (filters.jornada && course.jornada !== filters.jornada) return false;
        // if (filters.modulo && !course.modulo.includes(filters.modulo)) return false;
        return true;
    });
}
