import { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'date-range';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  searchValue,
  searchPlaceholder = 'Cari...',
  onSearchChange,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(values).some(v => v !== '' && v !== null && v !== undefined);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Filter</p>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search box */}
        {onSearchChange && (
          <div className="lg:col-span-4">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pencarian</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={searchValue || ''}
                onChange={e => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-transparent text-xs focus:outline-none flex-1 text-gray-700 placeholder-gray-400"
              />
              {searchValue && (
                <button onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic filters */}
        {filters.map(filter => (
          <div key={filter.id}>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{filter.label}</label>
            {filter.type === 'select' && (
              <select
                value={values[filter.id] || ''}
                onChange={e => onChange(filter.id, e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
              >
                <option value="">Semua</option>
                {filter.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {filter.type === 'text' && (
              <input
                value={values[filter.id] || ''}
                onChange={e => onChange(filter.id, e.target.value)}
                placeholder={filter.placeholder || ''}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
              />
            )}
            {filter.type === 'date' && (
              <input
                type="date"
                value={values[filter.id] || ''}
                onChange={e => onChange(filter.id, e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
              />
            )}
            {filter.type === 'date-range' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={values[`${filter.id}_start`] || ''}
                  onChange={e => onChange(`${filter.id}_start`, e.target.value)}
                  placeholder="Dari"
                  className="w-full text-xs border border-gray-200 rounded-xl px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
                <input
                  type="date"
                  value={values[`${filter.id}_end`] || ''}
                  onChange={e => onChange(`${filter.id}_end`, e.target.value)}
                  placeholder="Sampai"
                  className="w-full text-xs border border-gray-200 rounded-xl px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Filter aktif: {Object.entries(values).filter(([_, v]) => v).length} kriteria
          </p>
        </div>
      )}
    </div>
  );
}
