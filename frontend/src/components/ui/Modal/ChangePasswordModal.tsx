import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { ChangePasswordModalProps } from ".";

const ChangePasswordModal = ({
    open,
    title = "Cambiar contraseña",
    onConfirm,
    onCancel,
}: ChangePasswordModalProps) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const isDisabled =
        loading ||
        !password ||
        !confirmPassword ||
        password !== confirmPassword;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm(password);
            setPassword("");
            setConfirmPassword("");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return;
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={handleCancel}
            />

            <div
                className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4">{title}</h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-sm text-red-500 ml-1">
                            Las contraseñas no coinciden
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg ${
                            isDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Guardando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
