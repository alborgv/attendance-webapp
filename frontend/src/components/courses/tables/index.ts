import { CourseFilters } from "@/components/filters";

export interface Props<T> {
    data: T[];
    loading: boolean;
    onRefresh: () => void;
    filters: CourseFilters;
    onFilter: (filters: CourseFilters) => void;
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}