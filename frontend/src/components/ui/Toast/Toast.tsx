import { useEffect, useRef, useState } from 'react';
import { ToastProps } from '@/types/ui/toast';
import { LuCircleAlert, LuCircleCheck, LuCircleX, LuInfo } from 'react-icons/lu';

interface ToastPropsExtends extends ToastProps {
    onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastPropsExtends) => {
    const [isExiting, setIsExiting] = useState(false);
    const closedRef = useRef(false);

    const close = () => {
        if (closedRef.current) return;
        closedRef.current = true;
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
    };

    useEffect(() => {
        const timer = setTimeout(close, 3000);
        return () => clearTimeout(timer);
    }, []);

    const config = {
        success: { bg: 'bg-green-50 border-green-200', icon: <LuCircleCheck /> },
        error: { bg: 'bg-red-50 border-red-200', icon: <LuCircleX /> },
        warning: { bg: 'bg-yellow-50 border-yellow-200', icon: <LuCircleAlert /> },
        info: { bg: 'bg-blue-50 border-blue-200', icon: <LuInfo /> },
    }[type];

    return (
        <div
            className={`
                ${config.bg}
                pointer-events-auto
                border rounded-lg shadow-lg
                min-w-[320px] p-4
                transition-all duration-300
                ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
            `}
        >
            <div className="flex items-center gap-3 text-sm font-medium">
                {config.icon}
                {message}
            </div>
        </div>
    );
};

export default Toast;
