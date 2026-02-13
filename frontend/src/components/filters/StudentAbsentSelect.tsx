import React, { useState, useRef, useEffect } from 'react';
import { FilterProps, isStudentAbsentPreset, StudentAbsentFilter, StudentAbsentPreset } from '.';
import { getDateRangeByPreset } from '@/utils/filters/dateRangeFilters';
import { IoIosArrowDown } from 'react-icons/io';
import { toFormatDate } from '@/utils/date.utils';
import { useSearchParams } from 'react-router-dom';

const StudentAbsentSelect: React.FC<FilterProps<StudentAbsentFilter>> = ({ 
  value, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomInputs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("PRESET")
    const paramsPreset = searchParams.get("preset");

    if (!paramsPreset) return;
    if (!isStudentAbsentPreset(paramsPreset)) return;

    if (paramsPreset === value?.preset) return;

    if (paramsPreset === "CUSTOM") {
      const start = searchParams.get("startDate") ?? "";
      const end = searchParams.get("endDate") ?? "";

      onChange({
        preset: "CUSTOM",
        startDate: start,
        endDate: end,
      });

      return;
    }

    const range = getDateRangeByPreset(paramsPreset);

    onChange({
      preset: paramsPreset,
      startDate: range.startDate,
      endDate: range.endDate,
    });

  }, [searchParams]);

  const handlePresetSelect = (preset: StudentAbsentPreset) => {
    const params = new URLSearchParams(searchParams);
    params.set("preset", preset);
    setSearchParams(params);
  };

  const handleDateChange = (type: 'start' | 'end', date: string) => {    
    if (type === 'start') {
      setTempStartDate(date);
    } else {
      setTempEndDate(date);
    }
  };

  const handleCustomRangeApply = () => {
    const params = new URLSearchParams(searchParams);

    params.set("preset", "CUSTOM");
    params.set("startDate", tempStartDate);
    params.set("endDate", tempEndDate);

    setSearchParams(params);
  };

  const presetOptions: Array<{value: StudentAbsentPreset, label: string}> = [
    { value: 'TODAY', label: 'Hoy' },
    { value: 'YESTERDAY', label: 'Ayer' },
    { value: 'LAST_7_DAYS', label: 'Últimos 7 días' },
    { value: 'LAST_30_DAYS', label: 'Últimos 30 días' },
    { value: 'THIS_MONTH', label: 'Este mes' },
    { value: 'LAST_MONTH', label: 'Mes anterior' },
    { value: 'CUSTOM', label: 'Rango personalizado' },
  ];

  const currentPresetLabel = presetOptions.find(opt => opt.value === value?.preset)?.label || 'Filtrar por fecha';

  const handleOptionClick = (preset: StudentAbsentPreset) => {
    if (preset === 'CUSTOM') {
      setShowCustomInputs(true);
    } else {
      handlePresetSelect(preset);
      setIsOpen(false);
    }
  };

  const handleApplyClick = () => {
    handleCustomRangeApply();
    setIsOpen(false);
    setShowCustomInputs(false);
  };

  const handleCancelClick = () => {
    setShowCustomInputs(false);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="inline-flex flex-col gap-1 items-center justify-center px-4 text-sm font-medium text-gray-700
        bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="flex items-center gap-1">
          {currentPresetLabel}
          <IoIosArrowDown size={16} className="mt-1"/>
        </span>
        <span className="text-xs text-gray-500">
          {toFormatDate(value?.startDate ?? "")} - {toFormatDate(value?.endDate ?? "")}
        </span>

      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {!showCustomInputs && presetOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${
                  value?.preset === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}

            {showCustomInputs && (
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAbsentSelect;