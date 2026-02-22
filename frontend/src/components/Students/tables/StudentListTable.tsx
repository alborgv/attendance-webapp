import React from 'react';
import { FaSync, FaUserGraduate } from 'react-icons/fa';
import DataTable from '../../ui/Table/variants/DataTable';
import { Student, StudentFilters } from '@/components/Students';
import { Column } from '@/components/ui/Table/variants';
import StatusFilterSelect from '@/components/filters/StatusFilterSelect';
import { ScheduleFilter, StatusFilter } from '@/components/filters';
import ScheduleFilterSelect from '@/components/filters/ScheduleFilterSelect';

const ITEMS_PER_PAGE = 8;

interface Props<T> {
    data: T[];
    loading: boolean;
    onRefresh: () => void;
    filters: StudentFilters;
    onFilter: (filters: StudentFilters) => void;
    count: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const StudentListTable: React.FC<Props<Student>> = ({
        data,
        loading,
        onRefresh,
        filters,
        onFilter,
        count,
        currentPage,
        onPageChange
    }) => {
    
    const columns: Column<Student>[] = [
        {
            key: 'student',
            header: (
                <div className="flex items-center">
                    <FaUserGraduate className="mr-2 hidden md:inline" />
                    <span>Estudiante</span>
                </div>
            ),
            
            value: student =>
                `${student.nombre_completo} ${student.numero_identificacion}`,
            // searchable: true,
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
                            {student.tipo_identificacion} {student.numero_identificacion}
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

     const handleStatusChange = (status: StatusFilter) => {
        onFilter({
            ...filters,
            status
        });
    };

    
    const handleScheduleChange = (jornada: ScheduleFilter) => {
        onFilter({
            ...filters,
            jornada
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
            rowKey="id"
            count={count}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onSearch={handleSearchChange}
            headerActions={
                <>
                    <ScheduleFilterSelect value={filters.jornada ?? ''} onChange={handleScheduleChange}/>
                    <StatusFilterSelect value={filters.status ?? 'A'} onChange={handleStatusChange}/>
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

export default StudentListTable;