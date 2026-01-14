import { useQuery } from '@/context/QueryContext';
import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaSync,
    FaKey, FaTrash, FaUserGraduate, } from 'react-icons/fa';
import TableSkeleton from '../Skeleton/TableSkeleton';

const itemsPerPage = 8;

const MonitorTable: React.FC = () => {
    const { getAllMonitor, deleteMonitor } = useQuery();
    
    const [data, setData] = useState<MonitorProps[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMonitors = async () => {
        setLoading(true);
        try {
            const monitors = await getAllMonitor();
            setData(monitors)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMonitors();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchMonitors();
    };

    const handleChangePassword = (monitor: MonitorProps) => {
        console.log('Change password:', monitor);
    };

    const handleDelete = (monitor: MonitorProps) => {
        // console.log('Delete monitor:', monitor);
        deleteMonitor(monitor.id)
    };

    const filteredAndSorted = useMemo(() => {
        let filtered = data;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(m =>
                m.nombre_completo.toLowerCase().includes(term) ||
                m.numero_documento.toLowerCase().includes(term) ||
                m.tipo_documento.toLowerCase().includes(term)
            );
        }

        return [...filtered]
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSorted.slice(indexOfFirstItem, indexOfLastItem);


    const getStatusBadge = (estado: MonitorProps['estado']) => {
        switch (estado) {
            case 'ACT':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'INA':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return '';
        }
    };

    if (loading) {
        return <TableSkeleton/>
    }

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar monitor..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white
                        rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaSync className={refreshing ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                                    <div className="flex items-center">
                                        <FaUserGraduate className="mr-2 hidden md:inline" />
                                        <span className="text-xs md:text-sm">Monitor</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                                    <div className="flex items-center">
                                        <span className="text-xs md:text-sm">Estado</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                                    <div className="flex items-center">
                                        <span className="text-xs md:text-sm">Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map(monitor => (
                                <tr key={monitor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-8 w-8 md:h-10 md:w-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                                {monitor.nombre_completo?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {monitor.nombre_completo}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {monitor.tipo_documento} {monitor.numero_documento}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className='flex items-center'>
                                            <div className={`mr-2 md:mr-3 h-2 w-2 md:h-3 md:w-3 rounded-full ${monitor.estado === 'ACT' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                            <span
                                                className={`inline-flex px-2 py-0.5 md:px-3 md:py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                                                    monitor.estado
                                                )}`}
                                            >
                                                {monitor.estado === "ACT" ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleChangePassword(monitor)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaKey />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(monitor)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        {/* Info */}
                        <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <strong>{indexOfFirstItem + 1}</strong> a{' '}
                            <strong>{Math.min(indexOfLastItem, data.length)}</strong>{' '}
                            de <strong>{data.length}</strong> registros
                        </p>

                        {/* Paginación */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 md:p-3 rounded-xl ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                    }`}
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium ${currentPage === pageNum
                                        ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`p-2 md:p-3 rounded-xl ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                    }`}
                            >
                                <FaChevronRight />
                            </button>

                            <span className="hidden md:block ml-3 text-sm text-gray-700">
                                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                            </span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default MonitorTable;
