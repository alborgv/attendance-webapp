import React, { useState, useRef } from 'react';
import { useQuery } from '@/context/QueryContext';
import { Student } from '@/components/Students';
import StudentSelectionModal from '../../students/modals/StudentSelectionModal';
import { CreateCourseModalProps } from '@/types/ui/modals';

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
    isOpen,
    onClose,
    onCourseCreated
}) => {
    const [formData, setFormData] = useState({
        modulo: '',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    const { createCourse } = useQuery();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSelectStudents = (students: Student[]) => {
        setSelectedStudents(students);
    };

    const removeStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.filter(student => student.numero_identificacion !== studentId)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.modulo.trim()) {
            setError('El nombre del curso es obligatorio');
            setLoading(false);
            return;
        }

        if (selectedStudents.length === 0) {
            setError('Debes seleccionar al menos un estudiante');
            setLoading(false);
            return;
        }

        try {
            const courseData = {
                modulo: formData.modulo,
                fecha: formData.fecha,
                estudiantes: selectedStudents.map(student => student.id)
            };

            const result = await createCourse(courseData);
            
            console.log("RES:", result)
            onCourseCreated(result);
            handleClose();
            
        } catch (err: any) {
            setError(err.message || 'Error al crear el curso');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            modulo: '',
            fecha: new Date().toISOString().split('T')[0]
        });
        setSelectedStudents([]);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div 
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
                    onClick={handleClose}
                />
                
                <div
                    ref={modalRef}
                    className="relative shadow-2xl rounded-2xl max-w-2xl w-full mx-4 border border-gray-200"
                >
                    <div className="bg-blue-600 text-white p-4 rounded-xl">
                        <h2 className="text-xl font-semibold">Crear nuevo curso</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Completa la información del curso y selecciona los estudiantes
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 bg-white">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="modulo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Curso*
                                </label>
                                <input
                                    type="text"
                                    id="modulo"
                                    name="modulo"
                                    value={formData.modulo}
                                    onChange={handleInputChange}
                                    placeholder="Ingresa el nombre del curso"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estudiantes*
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsStudentModalOpen(true)}
                                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600"
                                >
                                    + Agregar Estudiantes ({selectedStudents.length} seleccionados)
                                </button>
                                
                                {selectedStudents.length > 0 && (
                                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                        {selectedStudents.map((student) => (
                                            <div
                                                key={student.numero_identificacion}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                            >
                                                <div>
                                                    <span className="font-medium text-gray-900">
                                                        {student.nombre_completo}
                                                    </span>
                                                    <span className="text-sm text-gray-600 ml-2">
                                                        ({student.tipo_identificacion}: {student.numero_identificacion})
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeStudent(student.numero_identificacion)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-medium"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                        Creando...
                                    </div>
                                ) : (
                                    'Crear Curso'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <StudentSelectionModal
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onSelectStudents={handleSelectStudents}
                selectedStudents={selectedStudents}
            />
        </>
    );
};

export default CreateCourseModal;