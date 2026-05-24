'use client';

import { useMemo } from 'react';
import { COMPANIES } from '@/entities/company';
import {
  summarizeBySourceForStage,
  getSourceColor,
  getSourceLabel,
} from '@/entities/emission';
import type { PcfLifecycleStage } from '@/entities/emission';
import { formatNumber } from '@/shared/lib/format';

interface StageDetailProps {
  stage: PcfLifecycleStage | null;
}

export const StageDetail = ({ stage }: StageDetailProps) => {
  const allEmissions = useMemo(() => COMPANIES.flatMap((c) => c.emissions), []);
  const summary = useMemo(
    () => summarizeBySourceForStage(allEmissions, stage?.id ?? ''),
    [allEmissions, stage],
  );

  if (!stage) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base text-cyan-500">위 단계를 클릭하면 배출원 상세를 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  const entries = Object.entries(summary.bySource) as [string, number][];
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {stage.label} <span className="text-gray-400 font-semibold">({stage.code})</span> 배출 상세
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">{stage.description}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">
            {formatNumber(summary.total, 1)}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">tCO₂e 합계</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map(([source, value]) => {
          const color = getSourceColor(source);
          const pct = (value / max) * 100;
          return (
            <div key={source} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-semibold truncate" style={{ color }}>{getSourceLabel(source)}</span>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums w-24 text-right shrink-0" style={{ color }}>
                {formatNumber(value, 1)} tCO₂e
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
