import React from 'react';

interface TableContainerProps {
    children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
    return (
        <div className="bg-white rounded-t-2xl shadow-lg border-r border-l border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
};

export default TableContainer;
