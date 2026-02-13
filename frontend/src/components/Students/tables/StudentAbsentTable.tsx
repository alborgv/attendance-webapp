import React, { useState } from 'react';
import { FaSync, FaUserGraduate } from 'react-icons/fa';
import { Column } from '@/components/ui/Table/variants';
import DataTable from '../../ui/Table/variants/DataTable';
import { toFormatDate } from '@/utils/date.utils';
import { StudentAbsentProps } from '..';
import { StudentAbsentFilter, ScheduleFilter, StatusFilter } from '@/components/filters';
import ScheduleFilterSelect from '@/components/filters/ScheduleFilterSelect';
import StudentAbsentSelect from '@/components/filters/StudentAbsentSelect';
import StatusFilterSelect from '@/components/filters/StatusFilterSelect';

const ITEMS_PER_PAGE = 8;

interface Props<T> {
    data: T[];
    loading: boolean;
    onRefresh: () => void;
    filters: StudentAbsentFilter;
    onFilter: (filters: StudentAbsentFilter) => void;
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const StudentAbsentTable: React.FC<Props<StudentAbsentProps>> = ({
    data,
    loading,
    onRefresh,
    filters,
    onFilter,
    count,
    currentPage,
    onPageChange
}) => {

    
    const columns: Column<StudentAbsentProps>[] = [
        {
            key: 'student',
            header: (
                <div className="flex items-center">
                    <FaUserGraduate className="mr-2 hidden md:inline" />
                    <span>Estudiante</span>
                </div>
            ),
            
            value: student =>
                `${student.nombre_completo} ${student.numero_documento}`,
            searchable: true,
            render: student => (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                        {student.nombre_completo.charAt(0)}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {student.nombre_completo}
                        </div>
                        <div className="text-xs text-gray-500">
                            {student.tipo_documento} {student.numero_documento}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'celular',
            header: 'Celular',
            render: student => (
                <span
                    className={`inline-flex text-sm font-semibold rounded-full`}
                >
                    {student.celular}
                </span>
            ),
        },
        {
            key: 'modulo',
            header: 'Módulo',
            render: student => (
                <span
                    className={`inline-flex text-sm font-semibold rounded-full`}
                >
                    {student.modulo}
                </span>
            ),
        },
        {
            key: 'jornada',
            header: 'Jornada',
            render: student => (
                <span
                    className={`inline-flex text-sm font-semibold rounded-full`}
                >
                    {student.jornada}
                </span>
            ),
        },
        {
            key: 'total_inasistencias',
            header: 'Total inasistencias',
            render: student => (
                <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full`}
                >
                    {student.total_inasistencia}
                </span>
            ),
        },
        {
            key: 'fecha',
            header: 'Fecha',
            render: student => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {toFormatDate(student.fecha)}
                    </div>
                </div>
            ),
        },
        {
            key: 'estado',
            header: 'Estado',
            render: student => (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${student.estado === 'A'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {student.estado === 'A' ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
    ];

    
    const today = new Date().toISOString().split("T")[0];
    
    const [range, setRange] = useState<StudentAbsentFilter>({
        startDate: today,
        endDate: today,
    });

    const handleScheduleChange = (jornada: ScheduleFilter) => {
        onFilter({
            ...filters,
            jornada
        });
    };

    const handleDateChange = (date: StudentAbsentFilter) => {
        onFilter({
            ...filters,
            startDate: date.startDate,
            endDate: date.endDate
        });
        setRange(date);
    };
    
    const handleStatusChange = (status: StatusFilter) => {
        onFilter({
            ...filters,
            status
        });
    };
        
    const handleSearchChange = (username: string) => {
        onFilter({
            ...filters,
            username
        });
    };
    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            itemsPerPage={ITEMS_PER_PAGE}
            searchPlaceholder="Buscar estudiante..."
            rowKey={(row) => `${row.id}-${row.modulo}-${row.fecha}`}
            count={count}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onSearch={handleSearchChange}
            headerActions={
                <>
                    {/* <StudentAbsentSelect value={filters.jornada ?? 'ALL'} onChange={handleDateChange}/> */}

                    <StudentAbsentSelect value={range} onChange={handleDateChange}/>
                    <StatusFilterSelect value={filters.status ?? 'A'} onChange={handleStatusChange}/>
                    <ScheduleFilterSelect value={filters.jornada ?? ''} onChange={handleScheduleChange}/>
                    
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600
                        text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                        shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
                    >
                        <FaSync />
                        Actualizar
                    </button>
                </>
            }
        />
    );
};

export default StudentAbsentTable;