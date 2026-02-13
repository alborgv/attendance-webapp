import React from 'react';
import { FaBook, FaSync } from 'react-icons/fa';
import { Column } from '@/components/ui/Table/variants';
import DataTable from '../../ui/Table/variants/DataTable';
import { CourseItem } from '@/types/props/attendance';
import { toFormatDate, formatDateTime } from '@/utils/date.utils';
import StatusFilterSelect from '@/components/filters/StatusFilterSelect';
import { Props } from '.';
import { StatusFilter } from '@/components/filters';

const ITEMS_PER_PAGE = 8;

const CourseListTable: React.FC<Props<CourseItem>> = ({
        data,
        loading,
        onRefresh,
        filters,
        onFilter,
        count,
        currentPage,
        onPageChange
    }) => {

    const columns: Column<CourseItem>[] = [
        {
            key: 'modulo',
            header: (
                <div className="flex items-center">
                    <FaBook className="mr-2 hidden md:inline" />
                    <span>Nombre del curso</span>
                </div>
            ),
            value: course => `${course.modulo}`,
            searchable: true,
            render: course => (
                <span
                    className={`inline-flex text-sm font-semibold rounded-full`}
                >
                    {course.modulo}
                </span>
            ),
        },
        {
            key: 'monitor',
            header: 'monitor',
            searchable: true,
            value: course => `${course.monitor}`,
            render: course => (
                <span
                    className={`inline-flex text-sm font-semibold rounded-full`}
                >
                    {typeof course.monitor === "string" ? course.monitor : null}
                </span>
            ),
        },
        {
            key: 'total_estudiantes',
            header: 'Total estudiantes',
            render: course => (
                <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full`}
                >
                    {course.total_estudiantes}
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
        {
            key: 'fecha',
            header: 'Fecha inicio',
            render: student => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {toFormatDate(student.fecha)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatDateTime(student.fecha)}
                    </div>
                </div>
            ),
        },
    ];

     const handleStatusChange = (status: StatusFilter) => {
        onFilter({
            ...filters,
            status
        });
    };
    
    const handleSearchChange = (course: string) => {
        onFilter({
            ...filters,
            course
        });
    };

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            itemsPerPage={ITEMS_PER_PAGE}
            searchPlaceholder="Buscar curso..."
            rowKey="id"
            count={count}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onSearch={handleSearchChange}
            headerActions={
                <>
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

export default CourseListTable;