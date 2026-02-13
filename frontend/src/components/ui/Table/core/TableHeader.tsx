import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

interface TableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  actions?: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Buscar...',
  actions,
}) => {
  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const handleSearch = () => {
    onSearchChange(localValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">

        <div className="flex-1 relative">

          <input
            type="text"
            value={localValue}
            placeholder={placeholder}
            onChange={e => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-2 pr-28 py-3 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       px-4 py-2 bg-blue-600 text-white text-sm
                       rounded-lg hover:bg-blue-700 transition"
          >
          <FaSearch className="" />
            
          </button>
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
