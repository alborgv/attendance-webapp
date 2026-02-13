import React, { useState } from "react";
import { AttendanceButtonProps } from "@/types/props/buttons";
import { IoSendOutline, IoReload, IoClose, IoDocumentTextOutline, IoAdd, IoPersonAdd } from "react-icons/io5";
import StudentSearchModal from "../../students/modals/StudentSearchModal";
import CreateStudentModal from "../../students/modals/CreateStudentModal";
import IconActionButton from "./IconActionButton";
import { LuLockKeyhole } from "react-icons/lu";
import ConfirmModal from "../Modal/ConfirmModal";

const AttendanceButton: React.FC<AttendanceButtonProps> = ({
    onSubmitAttendance,
    isSubmitting = false,
    onEditAttendance,
    isEdit,
    onAddStudent,
    onCreateStudent,
    onDeactivateCourse,
    course,
    canSubmit
}) => {
    
    const [isStudentSearchModalOpen, setIsStudentSearchModalOpen] = useState(false);
    const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
  
    const handleOpenConfirmModal = () => {
        setShowConfirm(true);
    };

    return (
        <>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <IconActionButton
                    icon={<LuLockKeyhole size={16} />}
                    label="Desactivar curso"
                    color="red"
                    onClick={handleOpenConfirmModal}
                    disabled={isEdit}
                />
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
                onSelectStudent={onAddStudent}
                course={course}
            />
            
            <CreateStudentModal
                isOpen={isCreateStudentModalOpen}
                onClose={handleCloseModal}
                onCreateStudent={onCreateStudent}
            />
            
            <ConfirmModal
                open={showConfirm}
                title="Desactivar curso"
                message="¿Estás seguro de que deseas desactivar este curso?"
                confirmText="Desactivar"
                cancelText="Cancelar"
                onCancel={() => setShowConfirm(false)}
                onConfirm={onDeactivateCourse}
                // onConfirm={async () => {
                //     if (!selectedCourse) return;
                //     await deactivateCourse(selectedCourse);
                //     setShowConfirm(false);
                // }}
            />

        </>

    );
};

export default AttendanceButton;
