'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YearFilterProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export const YearFilter = ({ years, selectedYear, onChange }: YearFilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-2xl px-4 py-2.5 hover:bg-cyan-100 transition-colors"
      >
        <span className="text-sm font-extrabold text-cyan-600">{selectedYear}년</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-cyan-400 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[110px]">
          {years.map((y) => {
            const active = selectedYear === y;
            return (
              <button
                key={y}
                onClick={() => { onChange(y); setOpen(false); }}
                className={cn(
                  'w-full px-5 py-2.5 text-sm font-semibold text-center transition-colors',
                  active
                    ? 'text-cyan-600 bg-cyan-50'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                )}
              >
                {y}년
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
