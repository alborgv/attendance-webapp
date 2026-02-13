import React, { useEffect, useRef, useState } from 'react';

import { useQuery } from '@/context/QueryContext';
import { Student } from '@/components/Students';
import { StudentSearchModalProps } from '@/types/ui/modals';
import ConfirmModal from '../../ui/Modal/ConfirmModal';
import { useToast } from '@/hooks/useToast';

const StudentSearchModal: React.FC<StudentSearchModalProps> = ({
    isOpen,
    onClose,
    onSelectStudent,
    course,
}) => {
    const toast = useToast();
    const { getAllStudentsBasic } = useQuery();
    const modalRef = useRef<HTMLDivElement>(null);

    const students = (course?.estudiantes || []).map((e) => ({
        id: e.id,
        nombre_completo: e.nombre_completo,
        numero_identificacion: e.numero_identificacion,
        tipo_identificacion: e.tipo_identificacion,
        numero: e.celular || '',
    }));

    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setFilteredStudents([]);
            setShowConfirmModal(false);
            setSelectedStudent(null);
        }
    }, [isOpen]);

    const isStudentAlreadyAdded = (student: Student) => {
        return students.some(
            (s) => s.numero_identificacion === student.numero_identificacion
        );
    };

    const handleStudentSelect = (student: Student) => {
        if (isStudentAlreadyAdded(student)) return;
        setSelectedStudent(student)
        setShowConfirmModal(true)
    };

    const handleSearchStudent = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 4) {
            const students = await getAllStudentsBasic({username: value});
            console.log("S:", students)
            setFilteredStudents(students.results);
        } else {
            setFilteredStudents([]);
        }
    };

    
    const handleConfirmAdd = () => {
        if (selectedStudent) {
            onSelectStudent(selectedStudent);
            setShowConfirmModal(false);
            setSelectedStudent(null);
            onClose();
            toast.success(`El estudiante "${selectedStudent.nombre_completo}" fue añadido a la lista.`)
        }
    };

    const handleCancelAdd = () => {
        setShowConfirmModal(false);
        setSelectedStudent(null);
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
            <div
                className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-md mx-4 border border-gray-200 rounded-2xl shadow-2xl bg-white"
            >
                <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">Buscar Estudiante</h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Busca por documento o nombre
                    </p>
                </div>

                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Ingresa número de documento o nombre..."
                        value={searchTerm}
                        onChange={handleSearchStudent}
                        autoFocus
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {filteredStudents.length === 0 && searchTerm.trim() !== '' ? (
                        <div className="p-4 text-center text-gray-500">
                            No se encontraron estudiantes
                        </div>
                    ) : (
                        filteredStudents.map((student) => {
                            const isAdded = isStudentAlreadyAdded(student);
                            
                            return (
                                <div
                                    key={student.id}
                                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${isAdded ? 'bg-gray-100 opacity-60' : ''
                                        }`}
                                    onClick={() => handleStudentSelect(student)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {student.nombre_completo}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {student.tipo_identificacion}:{' '}
                                                {student.numero_identificacion}
                                            </p>
                                            {student.celular && (
                                                <p className="text-sm text-gray-500">
                                                    Número: {student.celular}
                                                </p>
                                            )}
                                        </div>

                                        {isAdded && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                Agregado 
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
        <ConfirmModal
                open={showConfirmModal}
                title="Agregar estudiante"
                message={`¿Estás seguro que deseas agregar al estudiante ${selectedStudent?.nombre_completo}?`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                onCancel={handleCancelAdd}
                onConfirm={handleConfirmAdd}
            />
            </>
    );
};

export default StudentSearchModal;
