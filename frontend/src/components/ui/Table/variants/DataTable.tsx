import { useState } from 'react';
import TableHeader from '../core/TableHeader';
import TableContainer from '../core/TableContainer';
import TableHead from '../core/TableHead';
import TableBody from '../core/TableBody';
import TableFooter from '../core/TableFooter';
import TablePagination from '../core/TablePagination';
import MonitorTableSkeleton from '../../Skeleton/MonitorTableSkeleton';
import { DataTableProps } from '.';

const DataTable = <T,>({
    data,
    columns,
    loading = false,
    searchable = true,
    searchPlaceholder = 'Buscar...',
    itemsPerPage = 8,
    headerActions,
    emptyMessage = 'No hay registros para mostrar',
    rowKey,
    count,
    currentPage,
    onPageChange,
    onSearch,
}: DataTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');

    const totalPages = Math.ceil((count ?? data.length) / itemsPerPage);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        onSearch(value)
        onPageChange(1);
        
    };

    if (loading) {
        return (
            <MonitorTableSkeleton />
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)]">

            {searchable && (
                <TableHeader
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    actions={headerActions}
                />
            )}

            <TableContainer>
                <table className="min-w-full divide-y divide-gray-200">
                    <TableHead columns={columns} />
                    <TableBody
                        data={data}
                        columns={columns}
                        emptyMessage={emptyMessage}
                        rowKey={rowKey}
                    />
                </table>
            </TableContainer>

            <TableFooter
                currentPage={currentPage}
                totalItems={count ?? data.length}
                itemsPerPage={itemsPerPage}
            >
                {totalPages > 1 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </TableFooter>
        </div>
    );
};

export default DataTable;
