export interface Column<T> {
    key: string;
    header: React.ReactNode;
    value?: (row: T) => string;
    render: (row: T) => React.ReactNode;
    searchable?: boolean;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    count?: number | null;
    onPageChange: (page: number) => void;
    onSearch: (username: string) => void;
    currentPage: number;
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    itemsPerPage?: number;
    headerActions?: React.ReactNode;
    emptyMessage?: string;
    rowKey: keyof T | ((row: T) => string | number)
}