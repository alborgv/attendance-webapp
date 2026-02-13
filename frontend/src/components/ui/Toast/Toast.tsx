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
        success: { bg: 'bg-green-100 border-green-300', icon: <LuCircleCheck className="text-green-500" size={20}/> },
        error: { bg: 'bg-red-100 border-red-300', icon: <LuCircleX className="text-red-500" size={20}/> },
        warning: { bg: 'bg-yellow-100 border-yellow-300', icon: <LuCircleAlert className="text-yellow-500" size={20}/> },
        info: { bg: 'bg-blue-100 border-blue-300', icon: <LuInfo className="text-blue-500" size={20}/> },
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
