import type { GhgEmission, MonthlyEmissionRow, EmissionSummary } from './emission.types';
import { STAGE_RATIOS } from '../data/scopes';

export const SOURCE_COLORS: Record<string, string> = {
  electricity:  '#22c55e',
  diesel:       '#3b82f6',
  gasoline:     '#f97316',
  natural_gas:  '#8b5cf6',
  lpg:          '#ec4899',
};

export const SOURCE_LABELS: Record<string, string> = {
  electricity:  '전기',
  diesel:       '경유',
  gasoline:     '휘발유',
  natural_gas:  '천연가스',
  lpg:          'LPG',
};

export const getSourceColor = (source: string): string =>
  SOURCE_COLORS[source] ?? '#94a3b8';

export const getSourceLabel = (source: string): string =>
  SOURCE_LABELS[source] ?? source;

export const getUniqueSources = (emissions: GhgEmission[]): string[] =>
  Array.from(new Set(emissions.map((e) => e.source)));

export const groupEmissionsByMonth = (emissions: GhgEmission[]): MonthlyEmissionRow[] => {
  const map = new Map<string, MonthlyEmissionRow>();

  emissions.forEach(({ yearMonth, source, emissions: value }) => {
    if (!map.has(yearMonth)) {
      map.set(yearMonth, { month: yearMonth, total: 0 });
    }
    const row = map.get(yearMonth)!;
    row[source] = ((row[source] as number) || 0) + value;
    row.total   = (row.total as number) + value;
  });

  return Array.from(map.values()).sort((a, b) =>
    (a.month as string).localeCompare(b.month as string),
  );
};

export const summarizeBySource = (emissions: GhgEmission[]): EmissionSummary => {
  const bySource: Record<string, number> = {};
  let total = 0;

  emissions.forEach(({ source, emissions: value }) => {
    bySource[source] = (bySource[source] ?? 0) + value;
    total += value;
  });

  return { total, bySource };
};

export const summarizeBySourceForStage = (
  emissions: GhgEmission[],
  stageId: string,
): EmissionSummary => {
  const base = summarizeBySource(emissions);
  const stageRatio = STAGE_RATIOS[stageId] ?? {};
  const bySource: Record<string, number> = {};
  let total = 0;

  Object.entries(base.bySource).forEach(([source, value]) => {
    const ratio = stageRatio[source] ?? 0.2;
    const stageValue = Math.round(value * ratio * 10) / 10;
    bySource[source] = stageValue;
    total += stageValue;
  });

  return { total: Math.round(total * 10) / 10, bySource };
};
