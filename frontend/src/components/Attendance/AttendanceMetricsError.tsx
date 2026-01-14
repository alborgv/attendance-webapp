import { FaExclamationCircle, FaSync } from "react-icons/fa";

interface Props {
    error: string | null;
    refreshing: boolean;
    onRetry: () => void;
}

const AttendanceMetricsError: React.FC<Props> = ({ error, refreshing, onRetry }) => {
    return (
        <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <FaExclamationCircle className="text-red-500 text-xl mr-3" />
                    <h3 className="text-lg font-semibold text-red-800">Error al cargar</h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>

                <button
                    onClick={onRetry}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                >
                    <FaSync className={`${refreshing ? "animate-spin" : ""}`} />
                    Reintentar
                </button>
            </div>
        </div>
    );
};

export default AttendanceMetricsError;
