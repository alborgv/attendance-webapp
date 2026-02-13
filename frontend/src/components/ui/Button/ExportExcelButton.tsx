import React from "react";
import { RiFileExcel2Line } from "react-icons/ri";

interface ExportExcelButtonProps {
    refresh: boolean;
    onClick: () => void;
}


const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
    refresh,
    onClick,
}) => {

    return (
        <>
           <button
                onClick={onClick}
                // onClick={handleClick}
                disabled={refresh}
                className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white
                rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                <RiFileExcel2Line size={20} />
                <span className="font-semibold">Exportar</span>
            </button>
        </>

    );
};

export default ExportExcelButton;
