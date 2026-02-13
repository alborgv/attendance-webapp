import { ConfirmModalProps } from "@/types/ui/modals";
import { useState } from "react";

const ConfirmModal = ({
    open,
    title = "Confirmación",
    message,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
}: ConfirmModalProps) => {
    if (!open) return null;

    const [loading, setLoading] = useState<boolean>(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg 
                            ${loading ? "bg-gray-300 text-gray-500" : "bg-red-600 text-white hover:bg-red-700"}`}
                    >
                        {loading ? "Cargando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;