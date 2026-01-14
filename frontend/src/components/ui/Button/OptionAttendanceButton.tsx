import React, { useState } from "react";
import { IoCheckmarkOutline, IoClose, IoInformationCircleOutline } from "react-icons/io5";

interface StatusButtonProps {
    type: "present" | "absent" | "leave";
    isActive: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const StatusButton: React.FC<StatusButtonProps> = ({ 
    type, 
    isActive, 
    disabled = false, 
    onClick 
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const config = {
        present: {
            label: "Presente",
            activeClass: "bg-green-500 text-white shadow-md transform scale-105",
            inactiveClass: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
            disabledActiveClass: "bg-green-200 text-green-500 cursor-not-allowed opacity-60",
            disabledInactiveClass: "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300",
            icon: IoCheckmarkOutline,
            color: "green"
        },
        absent: {
            label: "Ausente",
            activeClass: "bg-red-500 text-white shadow-md transform scale-105",
            inactiveClass: "bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300",
            disabledActiveClass: "bg-red-200 text-red-500 cursor-not-allowed opacity-60",
            disabledInactiveClass: "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300",
            icon: IoClose,
            color: "red"
        },
        leave: {
            label: "Justificado",
            activeClass: "bg-blue-500 text-white shadow-md transform scale-105",
            inactiveClass: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300",
            disabledActiveClass: "bg-blue-200 text-blue-500 cursor-not-allowed opacity-60",
            disabledInactiveClass: "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300",
            icon: IoInformationCircleOutline,
            color: "blue"
        }
    };

    const { 
        label,
        activeClass, 
        inactiveClass, 
        disabledActiveClass, 
        disabledInactiveClass, 
        icon: IconComponent,
        color 
    } = config[type];

    const getButtonClasses = () => {
        if (disabled) {
            return isActive ? disabledActiveClass : disabledInactiveClass;
        }
        return isActive ? activeClass : inactiveClass;
    };

    const handleClick = () => {
        if (!disabled) {
            onClick();
            if (window.innerWidth < 640) {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 1500);
            }
        }
    };

    const handleTouchStart = () => {
        if (!disabled && window.innerWidth < 640) {
            setShowTooltip(true);
        }
    };

    const handleTouchEnd = () => {
        setTimeout(() => setShowTooltip(false), 1500);
    };

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`
                    flex items-center justify-center
                    rounded-xl transition-all duration-200 ease-in-out
                    font-medium
                    min-h-11 min-w-11 /* Tamaño mínimo para touch */
                    px-3 py-2.5
                    sm:px-4 sm:py-3
                    ${getButtonClasses()}
                    ${!disabled && "active:scale-95"}
                `}
                disabled={disabled}
                aria-label={label}
            >
                <IconComponent 
                    className={`
                        shrink-0
                        text-lg
                        sm:text-xl
                        md:text-2xl
                    `}
                />
            </button>

            {(showTooltip || disabled) && (
                <div 
                    className={`
                        absolute bottom-full mb-2 px-3 py-2 
                        rounded-lg text-sm font-medium
                        whitespace-nowrap
                        transition-all duration-200
                        z-50
                        ${disabled 
                            ? 'bg-gray-800 text-white' 
                            : color === 'green' ? 'bg-green-600 text-white' :
                              color === 'red' ? 'bg-red-600 text-white' :
                              'bg-blue-600 text-white'
                        }
                        shadow-lg
                        transform origin-bottom
                        ${showTooltip ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                    `}
                    style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                    }}
                >
                    {disabled ? `${label} (No disponible)` : label}
                    
                    <div 
                        className={`
                            absolute top-full left-1/2 transform -translate-x-1/2
                            border-4 border-transparent
                            ${disabled ? 'border-t-gray-800' : 
                              color === 'green' ? 'border-t-green-600' :
                              color === 'red' ? 'border-t-red-600' :
                              'border-t-blue-600'
                            }
                        `}
                    />
                </div>
            )}
        </div>
    );
};

export default StatusButton;