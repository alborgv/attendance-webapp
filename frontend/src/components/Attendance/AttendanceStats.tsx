import { AttendanceStatsProps } from "@/types/props/attendance";
import React from "react";

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
    totalStudents,
    presentCount,
    absentCount,
    leaveCount
}) => {

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Resumen de Asistencia</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">{totalStudents}</div>
                    <div className="text-sm text-blue-600">Total Estudiantes</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{presentCount}</div>
                    <div className="text-sm text-green-600">Presentes</div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="text-2xl font-bold text-red-700">{absentCount}</div>
                    <div className="text-sm text-red-600">Ausentes</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{leaveCount}</div>
                    <div className="text-sm text-purple-600">Justificados</div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceStats;