import React from 'react';

interface TableFooterProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    children: React.ReactNode;
}

const TableFooter: React.FC<TableFooterProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    children,
}) => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="px-4 py-3 border border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between gap-3 rounded-b-2xl">
            <p className="p-4 text-sm text-gray-700">
                Mostrando <strong>{start}</strong> a <strong>{end}</strong> de{' '}
                <strong>{totalItems}</strong> registros
            </p>

            {children}
        </div>
    );
};

export default TableFooter;
