export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
}

export interface ToastContextType {
    toasts: ToastProps[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}