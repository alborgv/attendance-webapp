import { CreateStudentModalProps } from '@/types/ui/modals';
import React, { useState, useRef, useEffect } from 'react';

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
    isOpen,
    onClose,
    onCreateStudent
}) => {
    const [formData, setFormData] = useState({
        primer_nombre: '',
        numero_identificacion: '',
        tipo_identificacion: 'EX',
        celular: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.primer_nombre.trim()) {
            setError('El primer nombre es obligatorio');
            setLoading(false);
            return;
        }

        if (!formData.numero_identificacion.trim()) {
            setError('El número de identificación es obligatorio');
            setLoading(false);
            return;
        }

        if (!formData.celular.trim()) {
            setError('El número de celular es obligatorio');
            setLoading(false);
            return;
        }

        try {
            await onCreateStudent?.(
                formData.primer_nombre,
                formData.numero_identificacion,
                formData.celular,
                formData.tipo_identificacion || "EX",
            );

            onClose();
            setFormData({
                primer_nombre: '',
                numero_identificacion: '',
                celular: '',
                tipo_identificacion: 'EX',
            });

        } catch (err: any) {
            setError(err.message || 'Error al crear el estudiante');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            primer_nombre: '',
            numero_identificacion: '',
            tipo_identificacion: 'CC',
            celular: ''
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div
                ref={modalRef}
                className="relative shadow-2xl rounded-2xl max-w-md w-full mx-4 border border-gray-200"
            >
                <div className="bg-green-600 text-white p-4 rounded-xl">
                    <h2 className="text-xl font-semibold">Crear Nuevo Estudiante</h2>
                    <p className="text-green-100 text-sm mt-1">
                        Completa la información básica del estudiante
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
                            <label htmlFor="primer_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre*
                            </label>
                            <input
                                type="text"
                                id="primer_nombre"
                                name="primer_nombre"
                                value={formData.primer_nombre}
                                onChange={handleInputChange}
                                placeholder="Ingresa el nombre"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="numero_identificacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Identificación*
                            </label>
                            <input
                                type="text"
                                id="numero_identificacion"
                                name="numero_identificacion"
                                value={formData.numero_identificacion}
                                onChange={handleInputChange}
                                placeholder="Ingresa el número de documento"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
                                Celular*
                            </label>
                            <input
                                type="tel"
                                id="celular"
                                name="celular"
                                value={formData.celular}
                                onChange={handleInputChange}
                                placeholder="Ingresa el número de celular"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
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
                            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                    Creando...
                                </div>
                            ) : (
                                'Crear Estudiante'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStudentModal;