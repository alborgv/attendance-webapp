import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import { ToastContextType, ToastProps } from '@/types/ui/toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext debe usarse dentro de ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = useCallback((message: string, type: ToastProps['type']) => {
        const id = Date.now().toString();
        const newToast: ToastProps = { id, message, type };

        setToasts((prev) => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}

            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="relative w-full h-full">
                    <div className="
                            fixed z-50
                            bottom-4 right-4
                            sm:bottom-4 sm:right-4
                            max-sm:left-1/2 max-sm:-translate-x-1/2
                        ">
                        {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={removeToast}
                        />
                    ))}
                    </div>
 
                </div>
            </div>
        </ToastContext.Provider>
    );
};