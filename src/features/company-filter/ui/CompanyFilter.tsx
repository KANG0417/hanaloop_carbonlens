'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPANIES } from '@/entities/company';
import { COUNTRIES } from '@/entities/country';

interface PickerItem {
  value: string | null;
  label: string;
}

interface PickerProps {
  tag: string;
  items: PickerItem[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

const Picker = ({ tag, items, selected, onSelect }: PickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const current = items.find((i) => i.value === selected) ?? items[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">{tag}</span>
        <span className="text-sm font-extrabold text-gray-700 max-w-[120px] truncate">{current.label}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[160px] max-h-64 overflow-y-auto">
          {items.map((item) => {
            const active = item.value === selected;
            return (
              <button
                key={item.value ?? '__all__'}
                onClick={() => { onSelect(item.value); setOpen(false); }}
                className={cn(
                  'w-full px-5 py-2.5 text-sm font-semibold text-left transition-colors',
                  active
                    ? 'text-cyan-600 bg-cyan-50'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface CompanyFilterProps {
  selectedCountryCode: string | null;
  selectedCompanyId: string | null;
  onCountryChange: (code: string | null) => void;
  onCompanyChange: (id: string | null) => void;
}

export const CompanyFilter = ({
  selectedCountryCode,
  selectedCompanyId,
  onCountryChange,
  onCompanyChange,
}: CompanyFilterProps) => {
  const activeCountryCodes = Array.from(new Set(COMPANIES.map((c) => c.country)));
  const activeCountries = COUNTRIES.filter((c) => activeCountryCodes.includes(c.code));

  const filteredCompanies = selectedCountryCode
    ? COMPANIES.filter((c) => c.country === selectedCountryCode)
    : COMPANIES;

  const handleCountryChange = useCallback((code: string | null) => {
    onCountryChange(code);
    onCompanyChange(null);
  }, [onCountryChange, onCompanyChange]);

  const countryItems: PickerItem[] = [
    { value: null, label: '전체' },
    ...activeCountries.map((c) => ({ value: c.code, label: `${c.flag} ${c.nameKo}` })),
  ];

  const companyItems: PickerItem[] = [
    { value: null, label: '전체' },
    ...filteredCompanies.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="flex items-center gap-2">
      <Picker tag="국가" items={countryItems} selected={selectedCountryCode} onSelect={handleCountryChange} />
      <Picker tag="회사" items={companyItems} selected={selectedCompanyId}   onSelect={onCompanyChange} />
    </div>
  );
};
