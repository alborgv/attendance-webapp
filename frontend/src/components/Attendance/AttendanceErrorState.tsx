import { IoAddCircle } from "react-icons/io5";

interface AttendanceErrorStateProps {
    error: string;
}

export const AttendanceErrorState: React.FC<AttendanceErrorStateProps> = ({
    error
}) => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-fluid max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-sans font-bold text-gray-900 mb-8">LISTA DE ASISTENCIAS ACTIVAS</h1>

                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white flex rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <IoAddCircle size={24} className='text-gray-800 mt-0.5' />
                            <span className="font-sans text-lg font-medium text-gray-800 ml-2">Crear curso</span>
                        </div>
                    </div>
                </div>

                <hr className='mb-6 opacity-20' />

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 font-semibold mb-2">Error al cargar los datos</div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceErrorState;
