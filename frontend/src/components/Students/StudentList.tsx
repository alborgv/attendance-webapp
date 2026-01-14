import React from "react";
import StudentRow from "@/components/Students/StudentRow";
import { StudentListProps } from "@/types/props/students";

const StudentList: React.FC<StudentListProps> = ({
    course,
    attendance,
    onAttendanceChange,
    onEditAttendance,
    isEdit
}) => {
    const students = (course?.estudiantes || []).map(e => ({
        id: e.id,
        nombre_completo: e.nombre_completo,
        numero_identificacion: e.numero_identificacion,
        tipo_identificacion: e.tipo_identificacion,
        numero: e.celular || "",
    }));

    return (
        <div className="space-y-3 mt-6">
            {students.map((student) => (
                <StudentRow
                    key={student.numero_identificacion}
                    student={student}
                    attendanceState={attendance[student.numero_identificacion] ?? "none"}
                    onAttendanceChange={onAttendanceChange}
                    onEditAttendance={onEditAttendance}
                    isEdit={isEdit}
                />
            ))}
        </div>
    );
};

export default StudentList;