import { useQuery } from "@/context/QueryContext";
import { Student } from "@/components/Students";
import { useRef, useState } from "react";

interface StudentSelectionProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectStudents: (students: Student[]) => void;
    selectedStudents: Student[];
}

const StudentSelectionModal: React.FC<StudentSelectionProps> = ({
    isOpen,
    onClose,
    onSelectStudents,
    selectedStudents
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [tempSelected, setTempSelected] = useState<Student[]>(selectedStudents);
    const modalRef = useRef<HTMLDivElement>(null);

    const { getAllStudentsBasic } = useQuery();

    const handleSearchStudent = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("HANDLEEEEEEEE")
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 4) {
            console.log("V:", value)
            const students = await getAllStudentsBasic({username: value});
            console.log("ST:", students)
            setFilteredStudents(students.results);
        } else {
            setFilteredStudents([]);
        }
    };

    const toggleStudentSelection = (student: Student) => {
        setTempSelected(prev => {
            const isSelected = prev.some(s => s.numero_identificacion === student.numero_identificacion);
            if (isSelected) {
                return prev.filter(s => s.numero_identificacion !== student.numero_identificacion);
            } else {
                return [...prev, student];
            }
        });
    };

    const isStudentSelected = (student: Student) => {
        return tempSelected.some(s => s.numero_identificacion === student.numero_identificacion);
    };

    const handleConfirmSelection = () => {
        onSelectStudents(tempSelected);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div 
                className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div
                ref={modalRef}
                className="relative shadow-2xl rounded-2xl max-w-2xl w-full mx-4 border border-gray-200 bg-white"
            >
                <div className="bg-blue-600 text-white p-4 rounded-xl">
                    <h2 className="text-xl font-semibold">Seleccionar Estudiantes</h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Busca y selecciona múltiples estudiantes
                    </p>
                </div>

                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Ingresa número de documento o nombre..."
                        value={searchTerm}
                        onChange={handleSearchStudent}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <div className="mt-2 text-sm text-gray-600">
                        {tempSelected.length} estudiante(s) seleccionado(s)
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {filteredStudents.length === 0 && searchTerm.trim() !== '' ? (
                        <div className="p-4 text-center text-gray-500">
                            No se encontraron estudiantes
                        </div>
                    ) : (
                        filteredStudents.map((student) => {
                            const isSelected = isStudentSelected(student);
                            return (
                                <div
                                    key={student.numero_identificacion}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                        isSelected ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                    onClick={() => toggleStudentSelection(student)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <div>
                                                <h3 className="font-medium text-gray-900">{student.nombre_completo}{student.id}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {student.tipo_identificacion}: {student.numero_identificacion}
                                                </p>
                                                {student.celular && (
                                                    <p className="text-sm text-gray-500">Celular: {student.celular}</p>
                                                )}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmSelection}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Confirmar ({tempSelected.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentSelectionModal;