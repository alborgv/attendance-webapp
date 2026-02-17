import React from "react";
import { format } from '@/utils/dateFormat';
import { IoTimeOutline } from "react-icons/io5";
import { AttendanceHeaderProps } from "@/types/props/attendance";

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({ selectedCourse, selectedDate, onDateChange, isEdit = false }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month, day] = e.target.value.split("-").map(Number);
        onDateChange(new Date(year, month - 1, day));
    };

    const desktopDateFormat = "EEEE, d 'de' MMMM 'de' yyyy";
    const mobileDateFormat = "d 'de' MMM 'de' yyyy";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
                
                <h1 className="font-sans font-bold text-gray-800 text-xl md:text-lg
                leading-snug wrap-break-word whitespace-normal max-w-full">
                    {selectedCourse?.modulo}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1 text-md sm:text-sm text-gray-600">
                    <span className="truncate">
                        Monitor: <strong className="text-gray-800">{typeof selectedCourse.monitor !== "string" ? selectedCourse.monitor.nombre_completo : null}</strong>
                    </span>
                    
                    <span className="hidden md:inline">•</span>
                    
                    <span className="flex items-center truncate">
                        <IoTimeOutline size={14} className="text-green-500 mr-1 shrink-0" />
                        <span className="hidden sm:inline">
                            {format(selectedDate, desktopDateFormat)}
                        </span>
                        <span className="sm:hidden">
                            {format(selectedDate, mobileDateFormat)}
                        </span>
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-end sm:justify-start">
                <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm w-full sm:w-auto">
                    <input
                        type="date"
                        value={format(selectedDate, "yyyy-MM-dd")}
                        onChange={handleChange}
                        className="outline-none text-gray-700 w-full text-sm sm:text-base"
                        disabled={isEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceHeader;