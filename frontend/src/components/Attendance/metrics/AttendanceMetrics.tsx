import { useQuery } from '@/context/QueryContext';
import { AttendanceMetricsData } from '@/types/props/attendance';
import React, { useState, useEffect } from 'react';
import { FaSync, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import MetricsAlertCard from '../../ui/Card/MetricsAlertCard';
import AttendanceMetricsLoading from './AttendanceMetricsLoading';
import AttendanceMetricsError from './AttendanceMetricsError';
import MetricsCard from '../../ui/Card/MetricsCard';
import { LuActivity, LuBookText, LuCalendarX, LuShieldAlert, LuUsers } from 'react-icons/lu';
import { FiAlertTriangle } from 'react-icons/fi';
import { formatDateTime } from '@/utils/date.utils';

const AttendanceMetrics: React.FC = () => {
    const { getAttendanceMetrics } = useQuery();

    const [metrics, setMetrics] = useState<AttendanceMetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const data = await getAttendanceMetrics();
            setMetrics(data);
        } catch (err) {
            setError('Error al cargar las métricas. Intente nuevamente.');
            console.error("Error fetching metrics:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMetrics();

        const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('es-ES').format(num);
    };

    if (loading && !metrics) {
        return <AttendanceMetricsLoading />;
    }

    if (error) {
        return (
            <AttendanceMetricsError
                error={error}
                refreshing={refreshing}
                onRetry={fetchMetrics}
            />
        );
    }
    
    return (
        <div className="mb-8 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className='px-4'>
                    <h2 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
                        RESUMEN ASISTENCIAS
                    </h2>
                    <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-sm">
                            Última actualización: {metrics ? formatDateTime(metrics.last_updated) : 'N/A'}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                        <FaChartLine />
                        <span className="text-sm font-medium">
                            {metrics ? formatNumber(metrics.total_estudiantes_activos) : 0} estudiantes activos
                        </span>
                    </div>
                    <button
                        onClick={fetchMetrics}
                        disabled={refreshing}
                        className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500
                        to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700
                        transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50
                        disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="font-semibold">Actualizar</span>
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
                <MetricsCard 
                    title={'Cursos activos'}
                    icon={<LuBookText size={20}/>}
                    value={metrics ? formatNumber(metrics.cursos_activos) : 0}
                    url={`/curso/lista`}
                    />
                <MetricsCard
                    title={'Total estudiantes'}
                    icon={<LuUsers size={20}/>}
                    value={metrics?.total_estudiantes || 0}
                    url={`/estudiantes/lista`}
                    />
                <MetricsCard
                    title={'Inasistencias hoy'}
                    icon={<LuCalendarX size={20}/>}
                    value={metrics ? formatNumber(metrics.total_ausentes) : 0}
                    url={`/estudiantes/ausentes?preset=TODAY`}
                    />
                    
                <MetricsCard 
                    title={'Inasistencias mes'}
                    icon={<LuActivity size={20}/>}
                    value={metrics ? formatNumber(metrics.total_ausentes_mes) : 0}
                    url={`/estudiantes/ausentes?preset=THIS_MONTH`}
                    />
                <MetricsCard
                    title={'Módulo con más inasistencias'}
                    icon={<LuShieldAlert size={20}/>}
                    value={metrics?.modulo_mas_ausentes}
                    url={`/asistencia/${metrics?.id_modulo_mas_ausentes}`} />
                <MetricsCard
                    title={'Estudiantes prontos de baja (3 inasistencias)'}
                    icon={<FiAlertTriangle size={20}/>}
                    value={metrics ? formatNumber(metrics.estudiantes_con_bajas) : 0}
                    url={`/estudiantes_en_riesgo`}
                    />
            </div>

            {metrics && (
                <MetricsAlertCard total={metrics.total_ausentes} />
            )}
        </div>
    );
};

export default AttendanceMetrics;