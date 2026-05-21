'use client';

import { formatEmission } from '@/shared/lib/emission-calculator';

interface EmissionSummaryCardProps {
  label: string;
  value: number;
  color: string;
  unit?: string;
}

export const EmissionSummaryCard = ({
  label,
  value,
  color,
  unit = 'kgCO₂e',
}: EmissionSummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800 tabular-nums">
        {formatEmission(value)}
      </p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
};
