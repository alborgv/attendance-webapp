import { StudentAlertFilter } from "@/components/filters";

export interface Props<T> {
    data: T[];
    loading: boolean;
    onRefresh: () => void;
    filters: StudentAlertFilter;
    onFilter: (filters: StudentAlertFilter) => void;
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}