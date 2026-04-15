import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuUpload, LuUserCheck } from 'react-icons/lu';
import { RiFileExcel2Line } from 'react-icons/ri';
import UploadFileModal from '@/components/ui/Modal/UploadFileModal';
import { useQuery } from '@/context/QueryContext';
import { useToast } from '@/hooks/useToast';

const navItems = [
    { label: 'Inicio', to: '/', icon: <LuLayoutDashboard size={18} /> },
    { label: 'Monitores', to: '/monitores', icon: <LuUserCheck size={18} /> },
];

const AdminSidebar = () => {
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const { uploadExcel, getAttendanceMetrics } = useQuery();
    const toast = useToast();
    const navigate = useNavigate();

    const handleUploadExcel = async (file: File | null) => {
        if (!file) return;
        try {
            await uploadExcel(file);
            await getAttendanceMetrics();
            toast.success('La información de los estudiantes se guardó con éxito.');
            setOpenUploadFile(false);
            navigate('/');
        } catch {
            toast.error('Error al importar el archivo.');
        }
    };

    return (
        <>
            {/* Desktop sidebar — always expanded, bg-primary to match navbar */}
            <aside className="hidden md:flex flex-col bg-primary w-52 shrink-0 min-h-full">

                {/* Nav links */}
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-white/20 text-white font-semibold border-l-2 border-white'
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white border-l-2 border-transparent'
                                }`
                            }
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-sm truncate">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Importar button */}
                    <button
                        onClick={() => setOpenUploadFile(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            text-blue-100 hover:bg-white/10 hover:text-white border-l-2 border-transparent cursor-pointer"
                    >
                        <span className="shrink-0"><RiFileExcel2Line size={18} /></span>
                        <span className="text-sm truncate">Importar Excel</span>
                    </button>
                </nav>
            </aside>

            {/* Mobile bottom bar — bg-primary to match */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-white/20 flex items-center justify-around px-2 py-2 shadow-lg">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors
                            ${isActive ? 'text-white font-semibold' : 'text-blue-200 hover:text-white'}`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
                <button
                    onClick={() => setOpenUploadFile(true)}
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-blue-200 hover:text-white transition-colors cursor-pointer"
                >
                    <LuUpload size={18} />
                    <span>Importar</span>
                </button>
            </nav>

            <UploadFileModal
                isOpen={openUploadFile}
                onClose={() => setOpenUploadFile(false)}
                onNext={handleUploadExcel}
            />
        </>
    );
};

export default AdminSidebar;
