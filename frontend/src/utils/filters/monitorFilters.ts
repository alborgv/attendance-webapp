import { StatusFilter } from "@/components/filters";

export function applyMonitorFilters(data: MonitorProps[], filter: StatusFilter) {
    return data.filter(monitor => {
        if (filter && monitor.estado !== filter) return false;
        return true;
    });
}
