import React from "react";
import AttendanceButton from "@/components/ui/Button/OptionAttendanceButton";
import { StudentRowProps } from "@/types/props/students";

const defaultAvatar =
"data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%236b7280' stroke-width='2' width='64' height='64'>\
<circle cx='32' cy='22' r='14'/>\
<path d='M12 52c6-10 34-10 40 0'/>\
</svg>";

const StudentRow: React.FC<StudentRowProps> = ({
    student,
    attendanceState,
    onAttendanceChange,
    isEdit,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3 sm:mb-0">
                <img
                    src={student.avatar || defaultAvatar}
                    alt={student.nombre_completo}
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
                />
                <div>
                    <div className="font-semibold text-sm md:text-lg text-gray-800">{student.nombre_completo}</div>
                    <div className="text-xs md:text-sm text-gray-500">
                        {student.tipo_identificacion}: {student.numero_identificacion}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <AttendanceButton
                    type="present"
                    isActive={attendanceState === "P"}
                    onClick={() => onAttendanceChange(student.numero_identificacion, "P")}
                    disabled={!isEdit}
                />
                <AttendanceButton
                    type="absent"
                    isActive={attendanceState === "A"}
                    onClick={() => onAttendanceChange(student.numero_identificacion, "A")}
                    disabled={!isEdit}
                />
                <AttendanceButton
                    type="leave"
                    isActive={attendanceState === "J"}
                    onClick={() => onAttendanceChange(student.numero_identificacion, "J")}
                    disabled={!isEdit}
                />
            </div>
        </div>
    );
};

export default StudentRow;
