import { ChangeEvent, useRef, useState } from "react";
import { LuFileSpreadsheet, LuUpload, LuX } from "react-icons/lu";
import { EXCEL_EXTENSIONS, EXCEL_MIME_TYPES } from ".";
import { FiLoader } from "react-icons/fi";

interface UploadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNext?: (file: File | null) => void;
}

export default function UploadFileModal({ isOpen, onClose, onNext }: UploadFileModalProps) {
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const simulateUpload = () => {
        setLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setLoading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleFile = (f: File) => {
        if (loading){
            
        }

        const extension = f.name.toLowerCase().slice(f.name.lastIndexOf("."));

        const isValidType =
            EXCEL_MIME_TYPES.includes(f.type) ||
            EXCEL_EXTENSIONS.includes(extension);

        if (!isValidType) {
            setError("Solo se permiten archivos Excel (.xls, .xlsx)");
            setFile(null);
            setProgress(0);
            return;
        }

        setError(null);
        setFile(f);
        simulateUpload();
    };

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (loading) {
            e.preventDefault();
            return;
        }

        if (e.target.files?.[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        if (loading) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleClose = () => {
        if (loading) return
        onClose();
        setFile(null);
        setError(null);
        setLoading(false);
    }

    const handleNext = async () => {
        try {
            setLoading(true);
            await onNext?.(file)
        } catch (err: any) {
            console.log("ERR:", err)
            setError(err.message || 'Error al crear el monitor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between px-6 py-4">
                    <h2 className="text-lg font-semibold">Subir archivo</h2>
                    <button onClick={handleClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
                        <LuX size={20} />
                    </button>
                </div>
                    {error && (
                        <p className="text-sm text-red-600 px-6">
                            {error}
                        </p>
                    )}
                <div className="px-6 py-5 space-y-4">
                    

                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (loading) return;
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <LuUpload className="text-blue-500" />
                            <p className="text-sm text-gray-600">
                                Arrastre y suelte el archivo aquí o <span className="text-blue-600 font-medium">Buscar archivo</span>
                            </p>
                            <p className="text-xs text-gray-400">Formatos compatibles: XLS, XLSX</p>
                            <p className="text-xs text-gray-400">Tamaño máximo: 25MB</p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xls,.xlsx"
                            hidden
                            disabled={loading}
                            onChange={(e) => handleChangeFile(e)}
                            // onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        />
                    </div>

                    {file && (
                        <div className="space-y-2 rounded-lg bg-neutral-200 p-3">
                            <div className="flex items-center gap-3">
                                <LuFileSpreadsheet className="text-green-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                                {!loading && (
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setProgress(0);
                                        }}
                                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <LuX size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full bg-blue-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-right text-xs text-gray-400">{progress}%</p>
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-end px-6 py-4">
                    <div className="flex gap-2">
                        <button
                            disabled={loading}
                            onClick={handleClose}
                            className="rounded-lg bg-gray-300 px-4 py-2 text-sm cursor-pointer
                            hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={!file || loading || progress < 100}
                            onClick={handleNext}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm
                            text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                            <>
                                <FiLoader className="h-4 w-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            "Continuar"
                        )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
