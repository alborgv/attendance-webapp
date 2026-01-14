import React from 'react';

export interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    withHeader?: boolean;
    withPagination?: boolean;
    withControls?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 8,
    columns = 4,
    withHeader = true,
    withPagination = true,
    withControls = true
}) => {
    const getRandomWidth = () => {
        const widths = ['w-32', 'w-40', 'w-48', 'w-56', 'w-64', 'w-72'];
        return widths[Math.floor(Math.random() * widths.length)];
    };

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 md:px-6">
            {withControls && (
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {withHeader && (
                            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                                <tr>
                                    {Array.from({ length: columns }).map((_, index) => (
                                        <th key={index} className="px-4 md:px-6 py-3 md:py-4">
                                            <div className={`h-4 bg-gray-200 rounded ${getRandomWidth()} animate-pulse`}></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-gray-200">
                            {Array.from({ length: rows }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <td key={colIndex} className="px-4 md:px-6 py-3 md:py-4">
                                            {colIndex === 0 ? (
                                                <div className="flex items-center">
                                                    <div className="shrink-0 h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                                    </div>
                                                </div>
                                            ) : colIndex === columns - 1 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                </div>
                                            ) : (
                                                <div className={`h-4 bg-gray-200 rounded ${getRandomWidth()} animate-pulse`}></div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {withPagination && (
                    <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div className="flex items-center gap-1 md:gap-2">
                                <div className="h-8 w-8 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableSkeleton;