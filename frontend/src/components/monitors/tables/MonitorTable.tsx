import React from 'react';
import { FaKey, FaTrash, FaSync, FaUserGraduate } from 'react-icons/fa';
import { Column } from '@/components/ui/Table/variants';
import DataTable from '../../ui/Table/variants/DataTable';
import StatusFilterSelect from '@/components/filters/StatusFilterSelect';
import { StatusFilter } from '@/components/filters';

const ITEMS_PER_PAGE = 8;

interface Props {
    data: MonitorProps[];
    loading: boolean;
    onRefresh: () => void;
    filters: StatusFilter,
    onFilter: (status: StatusFilter) => void;
    onChangePassword: (userId: number) => void;
    onDelete: (id: number) => void;
}

const MonitorTable: React.FC<Props> = ({
    data,
    loading,
    onRefresh,
    filters,
    onFilter,
    onChangePassword,
    onDelete
}) => {
    const columns: Column<MonitorProps>[] = [
        {
            key: 'monitor',
            header: (
                <div className="flex items-center">
                    <FaUserGraduate className="mr-2 hidden md:inline" />
                    <span>Monitor</span>
                </div>
            ),
            
            value: monitor =>
                `${monitor.nombre_completo} ${monitor.numero_documento}`,
            searchable: true,
            render: monitor => (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                        {monitor.nombre_completo.charAt(0)}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {monitor.nombre_completo}
                        </div>
                        <div className="text-xs text-gray-500">
                            {monitor.tipo_documento} {monitor.numero_documento}
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
            key: 'estado',
            header: 'Estado',
            render: monitor => (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${monitor.estado === 'A'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {monitor.estado === 'A' ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: monitor => (
                <div className="flex gap-3">
                    <button
                        onClick={() => onChangePassword(monitor?.id || 0)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                        <FaKey />
                    </button>
                    <button
                        onClick={() => onDelete(monitor.id || 0)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const handleStatusChange = (status: StatusFilter) => {
        onFilter(status);
    };
    
    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            itemsPerPage={ITEMS_PER_PAGE}
            searchPlaceholder="Buscar monitor..."
            rowKey="id"
            headerActions={
                <>
                    <StatusFilterSelect value={filters ?? 'A'} onChange={handleStatusChange}/>

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

export default MonitorTable;