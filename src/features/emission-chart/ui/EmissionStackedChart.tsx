'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyEmission } from '@/entities/emission';
import { ACTIVITY_TYPE_COLORS } from '@/shared/config/emission-factors';
import { formatEmission } from '@/shared/lib/emission-calculator';

interface EmissionStackedChartProps {
  data: MonthlyEmission[];
}

// YYYY-MM 형식을 'M월'로 변환
const formatMonthLabel = (month: string): string => {
  const m = parseInt(month.slice(5, 7), 10);
  return `${m}월`;
};

// 툴팁 포맷터 — Recharts ValueType은 undefined를 포함할 수 있어 방어 처리
const tooltipFormatter = (value: unknown): [string, string] => {
  const num = typeof value === 'number' ? value : 0;
  return [`${formatEmission(num)} kgCO₂e`, ''];
};

export const EmissionStackedChart = ({ data }: EmissionStackedChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 탄소 배출량 (kgCO₂e)</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonthLabel}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}t`}
          />
          <Tooltip formatter={tooltipFormatter} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
          />
          <Bar dataKey="전기" stackId="a" fill={ACTIVITY_TYPE_COLORS['전기']} radius={[0, 0, 0, 0]} />
          <Bar dataKey="원재료" stackId="a" fill={ACTIVITY_TYPE_COLORS['원재료']} radius={[0, 0, 0, 0]} />
          <Bar dataKey="이송" stackId="a" fill={ACTIVITY_TYPE_COLORS['이송']} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
