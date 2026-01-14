import React, { useState } from "react";
import { AttendanceButtonProps } from "@/types/props/buttons";
import { IoSendOutline, IoReload, IoClose, IoDocumentTextOutline, IoAdd, IoPersonAdd } from "react-icons/io5";
import StudentSearchModal from "../Modal/StudentSearchModal";
import CreateStudentModal from "../Modal/CreateStudentModal";
import IconActionButton from "./IconActionButton";

const AttendanceButton: React.FC<AttendanceButtonProps> = ({
    onSubmitAttendance,
    isSubmitting = false,
    onEditAttendance,
    isEdit,
    onAddStudent,
    onCreateStudent,
    course,
    canSubmit
}) => {
    
    const [isStudentSearchModalOpen, setIsStudentSearchModalOpen] = useState(false);
    const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);

    const handleOpenStudentSearchModal = () => {
        setIsStudentSearchModalOpen(true);
    };
    
    const handleOpenCreateStudentModal = () => {
        setIsCreateStudentModalOpen(true);
    };

    
    const handleCloseModal = () => {
        setIsStudentSearchModalOpen(false);
        setIsCreateStudentModalOpen(false);
    };

    return (
        <>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <IconActionButton
                    icon={<IoPersonAdd size={16} />}
                    label="Registrar estudiante"
                    color="green"
                    onClick={handleOpenCreateStudentModal}
                    disabled={isEdit}
                />
                <IconActionButton
                    icon={<IoAdd size={16} />}
                    label="Añadir estudiante"
                    color="green"
                    onClick={handleOpenStudentSearchModal}
                    disabled={isEdit}
                />

                <IconActionButton
                    icon={isEdit ? <IoClose size={20} /> : <IoDocumentTextOutline size={16} />}
                    label={isEdit ? "Cancelar" : "Tomar asistencia"}
                    color={isEdit ? "red" : "blue"}
                    onClick={onEditAttendance}
                />

                <IconActionButton
                    icon={isSubmitting ? <IoReload className="animate-spin" size={16} /> : <IoSendOutline size={16} />}
                    label={isSubmitting ? "Enviando..." : "Enviar"}
                    color="blue"
                    onClick={onSubmitAttendance}
                    disabled={isSubmitting || !isEdit || !canSubmit}
                />
            </div>

            <StudentSearchModal
                isOpen={isStudentSearchModalOpen}
                onClose={handleCloseModal}
                onSelectStudent={onAddStudent!}
                course={course}
            />
            
            <CreateStudentModal
                isOpen={isCreateStudentModalOpen}
                onClose={handleCloseModal}
                onCreateStudent={onCreateStudent}
            />
        </>

    );
};

export default AttendanceButton;
