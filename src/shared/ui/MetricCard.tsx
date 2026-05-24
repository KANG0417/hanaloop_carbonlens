'use client';

import { formatNumber } from '@/shared/lib/format';

interface MetricCardProps {
  label: string;
  value: number;
  color: string;
  unit?: string;
}

export const MetricCard = ({ label, value, color, unit = 'tCO₂e' }: MetricCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      </span>
    </div>
    <div>
      <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">
        {formatNumber(value, 1)}
      </p>
      <p className="text-sm text-gray-400 mt-1.5 font-medium">{unit}</p>
    </div>
  </div>
);
