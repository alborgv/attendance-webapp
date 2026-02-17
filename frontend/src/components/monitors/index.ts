import { StatusFilter } from "../filters";

export interface CreateMonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateMonitor: (monitor: MonitorProps) => void;
}


export interface MonitorFilters extends PaginationParams {
    username?: string;
    status?: StatusFilter;
}