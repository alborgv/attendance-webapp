interface PageButtonProps {
    page: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PageButton: React.FC<PageButtonProps> = ({
    page,
    currentPage,
    onPageChange,
}) => {
    const isActive = currentPage === page;

    return (
        <button
            onClick={() => onPageChange(page)}
            className={`
                flex items-center justify-center
                rounded-lg font-medium transition-all duration-200
                min-w-8 h-8 text-xs
                sm:min-w-9 sm:h-9 sm:text-sm
                md:min-w-10 md:h-10 md:px-4
                ${isActive
                    ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 shadow-sm cursor-pointer'
                }
            `}
            aria-current={isActive ? 'page' : undefined}
        >
            {page}
        </button>
    );
};

export default PageButton;
