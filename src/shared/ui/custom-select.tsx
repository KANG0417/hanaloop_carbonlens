'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  hasError?: boolean;
  className?: string;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = '선택',
  hasError,
  className,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const normalized: SelectOption[] = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );
  const selected = normalized.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 text-sm transition-all duration-200',
          'focus-visible:outline-none',
          hasError
            ? 'border-red-400 ring-2 ring-red-400'
            : open
              ? 'border-cyan-400 ring-2 ring-cyan-400'
              : 'border-gray-200 hover:border-gray-300',
        )}
      >
        <span className={cn('truncate', selected ? 'text-gray-900 font-medium' : 'text-gray-400')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200',
          open && 'rotate-180',
        )} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 max-h-52 overflow-y-auto">
          {normalized.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors text-left',
                  active
                    ? 'text-cyan-600 bg-cyan-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                <span>{opt.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
