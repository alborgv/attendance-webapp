export interface CreateMonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateMonitor: (monitor: MonitorProps) => void;
}