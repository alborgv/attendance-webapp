import React from 'react';

interface MonitorTableSkeletonProps {
    rows?: number;
}

const MonitorTableSkeleton: React.FC<MonitorTableSkeletonProps> = ({ rows = 5 }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <div className="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorTableSkeleton;