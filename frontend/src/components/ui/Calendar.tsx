import React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isToday } from "date-fns";

import { format } from "@utils/dateFormat"
import { capitalizeFirst } from "@/utils/capitalizeFirst";
import { CalendarProps } from "@/types/props/ui";

const Calendar: React.FC<CalendarProps> = ({
    currentMonth,
    selectedDate,
    onMonthChange,
    onDateSelect,
    getDateAttendanceStatus,
    isEdit = false
}) => {
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const goPrevMonth = () => {
        if (!isEdit) onMonthChange(subMonths(currentMonth, 1));
    };

    const goNextMonth = () => {
        if (!isEdit) onMonthChange(addMonths(currentMonth, 1));
    };

    const handleDateSelect = (date: Date) => {
        if (!isEdit) onDateSelect(date);
    };

    return (
        <div className={`border border-gray-200 rounded-xl p-3 sm:p-4 mb-6 max-w-md mx-auto sm:max-w-full ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <button
                    onClick={goPrevMonth}
                    disabled={isEdit}
                    className={`p-1 sm:p-2 rounded-full transition-colors ${
                        isEdit 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                
                <div className="font-semibold text-base sm:text-lg text-gray-800 px-2 text-center">
                    {capitalizeFirst(format(currentMonth, "MMMM yyyy"))}
                </div>
                
                <button
                    onClick={goNextMonth}
                    disabled={isEdit}
                    className={`p-1 sm:p-2 rounded-full transition-colors ${
                        isEdit 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-xs text-center mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="font-medium text-gray-500 py-1 text-xs sm:text-xs">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`blank-${i}`} className="aspect-square p-1 sm:p-2 rounded-lg" />
                ))}

                {daysInMonth.map(day => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    const attendanceStatus = getDateAttendanceStatus(day);

                    let dayClass = "aspect-square flex flex-col items-center justify-center rounded-lg transition-colors ";
                    
                    if (!isEdit) {
                        dayClass += "cursor-pointer ";
                    }

                    if (isSelected) {
                        dayClass += "bg-blue-500 text-white font-semibold";
                    } else if (isCurrentDay) {
                        dayClass += "bg-blue-100 text-blue-700 font-semibold";
                    } else if (!isEdit) {
                        dayClass += "hover:bg-gray-100";
                    }

                    let indicator = null;
                    if (attendanceStatus === "all-present") {
                        indicator = <div className="h-1 w-1 rounded-full bg-green-500 mt-0.5"></div>;
                    } else if (attendanceStatus === "has-absent") {
                        indicator = <div className="h-1 w-1 rounded-full bg-red-500 mt-0.5"></div>;
                    }

                    return (
                        <div
                            key={day.toISOString()}
                            className={dayClass}
                            onClick={() => handleDateSelect(day)}
                        >
                            <span className="text-xs sm:text-sm">{format(day, 'd')}</span>
                            {indicator}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;