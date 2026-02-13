import React from 'react';
import { FaSync, FaUserGraduate } from 'react-icons/fa';
import DataTable from '../../ui/Table/variants/DataTable';
import { Column } from '@/components/ui/Table/variants';
import { Props } from '.';
import { StudentAlertProps } from '..';
import StatusFilterSelect from '@/components/filters/StatusFilterSelect';
import { StatusFilter } from '@/components/filters';

const ITEMS_PER_PAGE = 8;

const StudentRiskTable: React.FC<Props<StudentAlertProps>> = ({
    data,
    loading,
    onRefresh,
    filters,
    onFilter,
    count,
    currentPage,
    onPageChange
}) => {

    const columns: Column<StudentAlertProps>[] = [
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
        console.log("S:", status)
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
            rowKey="id"
            count={count}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onSearch={handleSearchChange}
            headerActions={
                <>
                    <StatusFilterSelect value={filters?.status ?? "A"} onChange={handleStatusChange}/>
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

export default StudentRiskTable;
