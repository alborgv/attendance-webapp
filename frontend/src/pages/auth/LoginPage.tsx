import React, { useState } from "react";
import elyonLogo from "@assets/elyon_logo.png";
import { useAuth } from "@context/AuthContext";
import { FaTimesCircle } from "react-icons/fa";
import { IoPersonOutline, IoLockClosedOutline, IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
    const navigate = useNavigate();

    const { loginUser, loading, error } = useAuth();

    const validateFields = () => {
        const errors: any = {};
        if (!username.trim()) errors.username = "El usuario es obligatorio";
        if (!password.trim()) errors.password = "La contraseña es obligatoria";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        if (!validateFields()) return;

        const login = await loginUser({ username, password });

        if (login) {
            requestAnimationFrame(() => {
                navigate('/');
            });
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-8 flex flex-col items-center">
                <img src={elyonLogo} alt="Elyon Logo" className="w-18 h-18 mb-3" />

                <p className="text-gray-600 text-center text-sm mb-4">
                    Ingresa tus datos para continuar
                </p>

                <form className="space-y-6 w-full" onSubmit={handleSubmit} noValidate>
                    
                    {error?.notAuth && (
                        <div
                            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm animate-fade-in"
                            role="alert"
                            aria-live="assertive"
                        >
                            <FaTimesCircle size={18} className="text-red-500" />
                            <p className="text-red-700 text-sm font-medium">
                                {error.notAuth}
                            </p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type="text"
                                aria-invalid={!!fieldErrors.username}
                                aria-describedby="username-error"
                                placeholder="Usuario"
                                className={`w-full px-4 py-3 pl-11 border rounded-xl bg-white shadow-sm transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:border-transparent
                                    ${fieldErrors.username
                                        ? "border-red-400 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoPersonOutline size={20} className="text-gray-500" />
                            </div>
                        </div>

                        {fieldErrors.username && (
                            <p id="username-error" className="text-red-600 text-xs pl-1 animate-fade-in">
                                {fieldErrors.username}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type="password"
                                aria-invalid={!!fieldErrors.password}
                                aria-describedby="password-error"
                                placeholder="Contraseña"
                                className={`w-full px-4 py-3 pl-11 border rounded-xl bg-white shadow-sm transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:border-transparent
                                    ${fieldErrors.password
                                        ? "border-red-400 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoLockClosedOutline size={20} className="text-gray-500" />
                            </div>
                        </div>

                        {fieldErrors.password && (
                            <p id="password-error" className="text-red-600 text-xs pl-1 animate-fade-in">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center items-center py-3 px-4
                            text-sm font-medium rounded-xl text-white shadow-md transition-all duration-200
                            bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {!loading ? (
                            <>
                                <IoExitOutline size={20} className="absolute left-4 text-blue-200" />
                                Iniciar Sesión
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Cargando...
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
