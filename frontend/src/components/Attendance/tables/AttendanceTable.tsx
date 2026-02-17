import { useQuery } from '@/context/QueryContext';
import { CourseItem } from '@/types/props/attendance';
import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaSort,
    FaSortUp, FaSortDown, FaSync, FaCalendarAlt, FaUserGraduate, FaList, FaTh } from 'react-icons/fa';
import AttendanceTableSkeleton from '../../ui/Skeleton/AttendanceTableSkeleton';
import { useNavigate } from 'react-router-dom';

interface SortConfig {
    key: keyof CourseItem;
    direction: 'asc' | 'desc';
}

type StatusFilter = 'A' | 'I';

const AttendanceTable: React.FC = () => {
    const { getCourses } = useQuery();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState<CourseItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('A');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fecha', direction: 'desc' });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isMobile, setIsMobile] = useState(false);
    const itemsPerPage = 8;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navigateToCourseDetail = (courseId: string) => {
        navigate(`/asistencia/${courseId}`);
    };

    const fetchCourses = async (status: StatusFilter) => {
        setLoading(true);
        try {
            const data = await getCourses({ estado: status });
            setCourseData(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCourses('A');
    }, [getCourses]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCourses(statusFilter);
    };

    const handleStatusFilterChange = (newFilter: StatusFilter) => {
        setStatusFilter(newFilter);
        setCurrentPage(1);
        fetchCourses(newFilter);
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = courseData;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>{
                
                if (!item.monitor || typeof item.monitor === "string") {
                    return item.modulo?.toLowerCase().includes(term);
                }

                item.monitor.numero_identificacion?.toString().toLowerCase().includes(term) ||
                item.monitor.nombre_completo?.toLowerCase().includes(term) ||
                item.modulo.toLowerCase().includes(term) ||
                item.monitor.tipo_identificacion?.toLowerCase().includes(term)
            });
        }

        filtered = [...filtered].sort((a, b) => {
            if (sortConfig.key === 'fecha') {
                const dateA = new Date(a.fecha).getTime();
                const dateB = new Date(b.fecha).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (sortConfig.key === 'monitor') {
                
                const aValue =
                typeof a.monitor === "object" && a.monitor !== null
                    ? a.monitor.nombre_completo ?? ""
                    : "";
                    
                const bValue =
                typeof b.monitor === "object" && b.monitor !== null
                    ? b.monitor.nombre_completo ?? ""
                    : "";

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            }
            
            const aValue = a[sortConfig.key] ?? "";
            const bValue = b[sortConfig.key] ?? "";

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            return 0;

        });

        return filtered;
    }, [courseData, searchTerm, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

    const requestSort = (key: keyof CourseItem) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof CourseItem) => {
        if (sortConfig.key !== key) return <FaSort className="ml-2 text-gray-400" />;

        return sortConfig.direction === 'asc'
            ? <FaSortUp className="ml-2 text-blue-600" />
            : <FaSortDown className="ml-2 text-blue-600" />;
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'A':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    dot: 'text-green-500',
                    border: 'border-green-200'
                };
            case 'I':
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    dot: 'text-gray-400',
                    border: 'border-gray-200'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    dot: 'text-gray-400',
                    border: 'border-gray-200'
                };
        }
    };

    const handleCourseClick = (item: CourseItem, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button, a')) {
            return;
        }
        navigateToCourseDetail(item.id);
    };

    
    if (loading) {
        return <AttendanceTableSkeleton />;
    }

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 md:px-6">

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por documento, monitor, módulo..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                            <FaFilter className="text-gray-400 mr-3" />
                            <select
                                className={`
                                    ${!isMobile ? "bg-transparent border-none focus:ring-0 outline-none text-gray-700 font-medium"
                                    : "absolute opacity-0"}`}
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value as StatusFilter)}
                            >
                                <option value="A" >Activos</option>
                                <option value="I">Inactivos</option>
                            </select>
                        </div>
                        

                        <div className="flex items-center bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-3 transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                title="Vista de tabla"
                            >
                                <FaList />
                                <span className={`${isMobile ? 'hidden' : 'hidden md:inline'}`}>Tabla</span>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-3 transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                title="Vista de cuadrícula"
                            >
                                <FaTh />
                                <span className={`${isMobile ? 'hidden' : 'hidden md:inline'}`}>Cuadrícula</span>
                            </button>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden md:inline font-semibold">Actualizar</span>
                            <span className="md:hidden font-semibold">Actualizar</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">{filteredAndSortedData.length}</span> cursos encontrados
                            {searchTerm && (
                                <span className="ml-2 text-blue-600">
                                    • Búsqueda: "{searchTerm}"
                                </span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500">
                            Mostrando <span className="font-semibold">{Math.min(itemsPerPage, currentItems.length)}</span> de {filteredAndSortedData.length} cursos
                        </p>
                    </div>
                </div>
            </div>

            {currentItems.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm
                            ? "No se encontraron cursos"
                            : `No hay cursos ${statusFilter === 'A' ? 'activos' : 'inactivos'}`
                        }
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        {searchTerm
                            ? "No encontramos cursos que coincidan con tu búsqueda. Intenta con otros términos."
                            : "Cuando se registren cursos, aparecerán aquí."
                        }
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium shadow-sm"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FaUserGraduate className="mr-2 hidden md:inline" />
                                            <span className="text-xs md:text-sm">Monitor</span>
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() => requestSort('modulo')}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-xs md:text-sm">Módulo</span>
                                            {getSortIcon('modulo')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-xs md:text-sm">Estado</span>
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() => requestSort('fecha')}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-xs md:text-sm">Fecha</span>
                                            {getSortIcon('fecha')}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentItems.map((item) => {
                                    const statusColors = getStatusColor(item.estado);
                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                                            onClick={(e) => handleCourseClick(item, e)}
                                        >
                                            
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center">
                                                    <div className="shrink-0 h-8 w-8 md:h-10 md:w-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                                        {typeof item.monitor !== "string"
                                                        ? item.monitor?.nombre_completo?.charAt(0) ?? "M"
                                                        : null}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {typeof item.monitor !== "string"
                                                            ? item.monitor.nombre_completo
                                                            : null}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {typeof item.monitor !== "string"
                                                            ? item.monitor.tipo_identificacion
                                                            : null}
                                                            &nbsp;
                                                            {typeof item.monitor !== "string"
                                                            ? item.monitor.numero_identificacion
                                                            : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.modulo}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center">
                                                    <div className={`mr-2 md:mr-3 h-2 w-2 md:h-3 md:w-3 rounded-full ${item.estado === 'A' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                    <span className={`inline-flex px-2 py-0.5 md:px-3 md:py-1 text-xs font-semibold rounded-full ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                                                        {item.estado === "A" ? "Activo" : "Inactivo"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatDate(item.fecha)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDateTime(item.fecha)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando <span className="font-bold">{indexOfFirstItem + 1}</span> a{' '}
                                    <span className="font-bold">
                                        {Math.min(indexOfLastItem, filteredAndSortedData.length)}
                                    </span>{' '}
                                    de <span className="font-bold">{filteredAndSortedData.length}</span> cursos
                                </p>
                            </div>

                            <div className="flex items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 md:p-3 rounded-xl ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <FaChevronLeft />
                                </button>

                                {getPageNumbers().map((pageNum, index) => (
                                    pageNum === '...' ? (
                                        <span key={`dots-${index}`} className="px-2 py-1 md:px-3 md:py-2 text-gray-500">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum as number)}
                                            className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base ${currentPage === pageNum
                                                ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 md:p-3 rounded-xl ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <FaChevronRight />
                                </button>

                                <div className="hidden md:block ml-2 md:ml-4 text-sm text-gray-700">
                                    Página <span className="font-bold">{currentPage}</span> de{' '}
                                    <span className="font-bold">{totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {currentItems.map((item) => {
                            const statusColors = getStatusColor(item.estado);
                            return (
                                <div
                                    key={item.id}
                                    className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group cursor-pointer"
                                    onClick={() => navigateToCourseDetail(item.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 md:h-12 md:w-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold mr-3">
                                                {typeof item.monitor !== "string"
                                                ? item.monitor?.nombre_completo?.charAt(0) ?? "M"
                                                : null}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                                                    {typeof item.monitor !== "string"
                                                    ? item.monitor.nombre_completo
                                                    : null}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {typeof item.monitor !== "string"
                                                    ? item.monitor.tipo_identificacion
                                                    : null}
                                                    
                                                    {typeof item.monitor !== "string"
                                                    ? item.monitor.numero_identificacion
                                                    : null}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${statusColors.bg} ${statusColors.text}`}>
                                            {item.estado === "A" ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-sm md:text-base mb-2 truncate" title={item.modulo}>
                                        {item.modulo}
                                    </h3>

                                    <div className="text-xs md:text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span>{formatDate(item.fecha)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Página <span className="font-bold">{currentPage}</span> de{' '}
                                    <span className="font-bold">{totalPages}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-1 md:gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 md:p-3 rounded-xl ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <FaChevronLeft />
                                </button>

                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((pageNum, index) => (
                                        pageNum === '...' ? (
                                            <span key={`dots-${index}`} className="px-1 py-0.5 md:px-2 md:py-1 text-gray-500">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum as number)}
                                                className={`px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium ${currentPage === pageNum
                                                    ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 md:p-3 rounded-xl ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceTable;