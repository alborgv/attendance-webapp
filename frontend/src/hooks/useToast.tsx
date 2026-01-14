import { useToastContext } from "@/components/ui/Toast/ToastContainer";

export const useToast = () => {
    const { addToast } = useToastContext();

    const toast = {
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        warning: (message: string) => addToast(message, 'warning'),
        info: (message: string) => addToast(message, 'info'),
    };

    return toast;
};