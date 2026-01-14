import { IoAddCircle } from "react-icons/io5";

interface EmptyAttendanceStateProps {
    onOpenCreateModal: () => void;
    viewMode: 'active' | 'inactive';
    onToggleViewMode: () => void;
}

export const EmptyAttendanceState: React.FC<EmptyAttendanceStateProps> = ({
    onOpenCreateModal,
    viewMode,
    onToggleViewMode
}) => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-sans font-bold text-gray-900">
                        {viewMode === 'active' ? 'LISTA DE ASISTENCIAS ACTIVAS' : 'LISTA DE ASISTENCIAS INACTIVAS'}
                    </h1>
                    
                    <button
                        onClick={onToggleViewMode}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        {viewMode === 'active' ? 'Ver Inactivos' : 'Ver Activos'}
                    </button>
                </div>

                {viewMode === 'active' && (
                    <>
                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button
                                    onClick={onOpenCreateModal}
                                    className="
                                        bg-white flex rounded-lg shadow-sm border border-gray-200 
                                        p-4 hover:shadow-md transition-shadow
                                    "
                                >
                                    <IoAddCircle size={24} className="text-gray-800 mt-0.5" />
                                    <span className="font-sans text-lg font-medium text-gray-800 ml-2">
                                        Crear curso
                                    </span>
                                </button>
                            </div>
                        </div>

                        <hr className="mb-6 opacity-20" />
                    </>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {viewMode === 'active' ? 'No hay cursos activos' : 'No hay cursos inactivos'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {viewMode === 'active' 
                            ? 'No se encontraron listas de asistencia activas para mostrar.'
                            : 'No se encontraron listas de asistencia inactivas para mostrar.'
                        }
                    </p>

                    {viewMode === 'active' && (
                        <button
                            onClick={onOpenCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            Crear curso
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyAttendanceState;