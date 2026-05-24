'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Zap, Droplets, Flame, type LucideIcon } from 'lucide-react';
import {
  groupEmissionsByMonth,
  summarizeBySource,
  getUniqueSources,
  getSourceColor,
  getSourceLabel,
} from '@/entities/emission';
import type { GhgEmission } from '@/entities/emission';
import { COMPANIES } from '@/entities/company';
import { formatNumber } from '@/shared/lib/format';

interface EmissionChartProps {
  emissions?: GhgEmission[];
}

const fmtMonth = (m: string) => `${parseInt(m.slice(5, 7), 10)}월`;

const SOURCE_ICONS: Record<string, LucideIcon> = {
  electricity: Zap,
  diesel:      Droplets,
  gasoline:    Droplets,
  natural_gas: Flame,
  lpg:         Flame,
};

function getSourceIcon(source: string): LucideIcon {
  return SOURCE_ICONS[source] ?? Zap;
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #f1f5f9',
      borderRadius: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      padding: '14px 18px',
      minWidth: '180px',
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        marginBottom: '10px',
        letterSpacing: '0.02em',
      }}>
        {fmtMonth(label ?? '')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {payload.map((entry) => {
          const Icon = getSourceIcon(entry.name);
          return (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Icon style={{ width: '14px', height: '14px', color: entry.color, flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 800, color: entry.color }}>
                  {getSourceLabel(entry.name)}
                </span>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: entry.color, fontVariantNumeric: 'tabular-nums' }}>
                {formatNumber(entry.value, 1)}
                <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8', marginLeft: '3px' }}>t</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const EmissionChart = ({ emissions }: EmissionChartProps) => {
  const all     = useMemo(() => emissions ?? COMPANIES.flatMap((c) => c.emissions), [emissions]);
  const monthly = useMemo(() => groupEmissionsByMonth(all), [all]);
  const summary = useMemo(() => summarizeBySource(all), [all]);
  const sources = useMemo(() => getUniqueSources(all), [all]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">월별 온실가스 배출량</h3>
          <p className="text-xs text-gray-400 mt-0.5">tCO₂e · 배출원별 추이</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-semibold text-cyan-500 bg-cyan-50 px-3 py-1 rounded-full">
            2025. 01 – 08
          </span>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">
              {formatNumber(summary.total, 1)}
              <span className="text-xs font-normal text-gray-400 ml-1">tCO₂e</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">총 배출량</p>
          </div>
        </div>
      </div>

      {/* 면적 + 라인 차트 */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthly} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            {sources.map((s: string) => (
              <linearGradient key={s} id={`grad-${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={getSourceColor(s)} stopOpacity={0.18} />
                <stop offset="95%" stopColor={getSourceColor(s)} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

          <XAxis
            dataKey="month"
            tickFormatter={fmtMonth}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}t`}
            width={52}
          />

          <Tooltip content={<CustomTooltip />} />

          {sources.map((s: string) => (
            <Area
              key={s}
              type="monotone"
              dataKey={s}
              name={s}
              stroke={getSourceColor(s)}
              strokeWidth={2}
              fill={`url(#grad-${s})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: getSourceColor(s) }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* 배출원별 요약 */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-4 mt-2 border-t border-gray-50">
        {sources.map((s: string) => {
          const Icon = getSourceIcon(s);
          return (
            <div key={s} className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 shrink-0" style={{ color: getSourceColor(s) }} />
                <span className="text-sm font-semibold" style={{ color: getSourceColor(s) }}>{getSourceLabel(s)}</span>
              </div>
              <span className="text-base font-bold tabular-nums" style={{ color: getSourceColor(s) }}>
                {formatNumber(summary.bySource[s] ?? 0, 1)}
                <span className="text-xs font-normal text-gray-400 ml-0.5">t</span>
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
