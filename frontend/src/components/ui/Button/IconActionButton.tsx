import { IconActionButtonProps } from "@/types/ui/buttons";

const COLORS = {
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
};

const IconActionButton = ({
    icon,
    label,
    color,
    onClick,
    disabled,
    loading,
}: IconActionButtonProps) => {
    return (
        <div className="relative group w-full sm:w-auto">
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`
                    w-full sm:w-12 sm:h-12
                    px-6 py-3 sm:p-0
                    rounded-lg sm:rounded-xl
                    text-white font-medium
                    flex items-center justify-center
                    transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${COLORS[color]}
                `}
            >
                {icon}

                <span className="ml-2 sm:hidden">
                    {loading ? "Cargando..." : label}
                </span>
            </button>

            <div
                className="
                    hidden sm:block
                    absolute bottom-full left-1/2 -translate-x-1/2
                    mb-2
                    px-3 py-1.5
                    rounded-lg
                    bg-black/80 text-white text-sm
                    shadow
                    opacity-0 scale-95
                    transition
                    group-hover:opacity-100 group-hover:scale-100
                    pointer-events-none
                    whitespace-nowrap
                    z-50
                "
            >
                {label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 
                                border-4 border-transparent border-t-black/80" />
            </div>
        </div>
    );
};

export default IconActionButton;