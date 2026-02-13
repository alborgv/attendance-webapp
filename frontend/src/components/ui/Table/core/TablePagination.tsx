import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PageButton from './PageButton';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const MAX_VISIBLE = 5;

    const getVisiblePages = () => {
        if (totalPages <= MAX_VISIBLE) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const half = Math.floor(MAX_VISIBLE / 2);
        let start = Math.max(currentPage - half, 1);
        let end = start + MAX_VISIBLE - 1;

        if (end > totalPages) {
            end = totalPages;
            start = end - MAX_VISIBLE + 1;
        }

        return Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
        );
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 md:p-3 rounded-xl ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                    }`}
            >
                <FaChevronLeft />
            </button>

            <div className="flex items-center gap-1">
                {visiblePages[0] > 1 && (
                    <>
                        <PageButton
                            page={1}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                        <span className="px-2 text-gray-400">…</span>
                    </>
                )}

                {visiblePages.map(page => (
                    <PageButton
                        key={page}
                        page={page}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                ))}

                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        <span className="px-2 text-gray-400">…</span>
                        <PageButton
                            page={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    </>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 md:p-3 rounded-xl ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-300 hover:border-blue-300'
                    }`}
            >
                <FaChevronRight />
            </button>
        </div>

    );
};

export default TablePagination;
