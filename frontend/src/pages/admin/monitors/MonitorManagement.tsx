import Layout from '@/components/Layout';
import MonitorTable from '@/components/monitors/tables/MonitorTable';
import { VolverPanel } from '@/components/ui/VolverPanel';
import { useQuery } from '@/context/QueryContext';
import { useEffect, useState } from 'react';
import { LuUserPlus } from 'react-icons/lu';
import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import ChangePasswordModal from '@/components/ui/Modal/ChangePasswordModal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import CreateMonitorModal from '@/components/monitors/modals/CreateMonitorModal';
import { MonitorFilters } from '@/components/monitors';

export default function MonitorManagement() {

    const { getAllMonitor, createMonitor, deleteMonitor } = useQuery();
    const { changeMonitorPassword } = useAuth();
    const toast = useToast();

    const [data, setData] = useState<MonitorProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [createMonitorModalOpen, setCreateMonitorModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(null);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [filters, setFilters] = useState<MonitorFilters>({
        status: 'A'
    });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);

    const fetchMonitors = async () => {
        setLoading(true);
        try {
            const response = await getAllMonitor({
                ...filters,
                page,
                pageSize,
            });
            setData(response.results);
            setCount(response.count);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitors();
    }, [filters, page]);

    const handleClick = async () => {
        setCreateMonitorModalOpen(true);
    }

    const handleCloseModal = async () => {
        setCreateMonitorModalOpen(false);
    }

    const handleFilter = (newFilters: MonitorFilters) => {
        setPage(1);
        setFilters(newFilters);
    };
    
    const handleDelete = (id: number) => {
        setSelectedMonitorId(id);
        setIsConfirmOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedMonitorId) return;

        try {
            await deleteMonitor(selectedMonitorId);
            await fetchMonitors();
        } finally {
            setIsConfirmOpen(false);
            setSelectedMonitorId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmOpen(false);
        setSelectedMonitorId(null);
    };

    const handleOpenChangePassword = (userId: number) => {
        setSelectedUserId(userId);
        setIsChangePasswordOpen(true);
    };

    const handleCreateMonitor = async (monitor: MonitorProps) => {
        const res = await createMonitor(monitor);
        setCreateMonitorModalOpen(false);
        toast.success(`Monitor fue actualizada correctamente. ${monitor.nombre_completo}`)
        await fetchMonitors();
        return res;
    };

    const handleChangePassword = async (password: string) => {
        if (!selectedUserId) return;

        await changeMonitorPassword(selectedUserId, password);
        setIsChangePasswordOpen(false);
        toast.success(`La contraseña fue actualizada correctamente.`)

    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Layout>
            <div className="mb-8 p-4 md:p-6">
                <VolverPanel />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className='px-4'>
                        <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                            LISTA DE MONITORES
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={handleClick}
                            disabled={loading}
                            className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white
                            rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <LuUserPlus size={20} />
                            <span className="font-semibold">Registrar monitor</span>
                        </button>
                    </div>
                </div>
                <MonitorTable 
                    data={data}
                    loading={loading}
                    onRefresh={fetchMonitors}
                    filters={filters}
                    onFilter={handleFilter}
                    onChangePassword={handleOpenChangePassword}
                    onDelete={handleDelete}
                    count={count}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            </div>
            
            <CreateMonitorModal
                isOpen={createMonitorModalOpen}
                onClose={handleCloseModal}
                onCreateMonitor={handleCreateMonitor}
            />

            <ConfirmModal
                open={isConfirmOpen}
                title="Eliminar monitor"
                message="¿Estás seguro de que deseas eliminar este monitor?"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            
            <ChangePasswordModal
                open={isChangePasswordOpen}
                onCancel={() => setIsChangePasswordOpen(false)}
                onConfirm={handleChangePassword}
            />

        </Layout>
    );
}