import { useMemo } from 'react';
import type { MonthlyEmission, EmissionSummary } from '@/entities/emission';
import { SAMPLE_EMISSION_RECORDS } from '@/shared/data/sample-emission-data';
import { groupByMonth, summarizeEmissions } from '@/shared/lib/emission-calculator';

interface UseEmissionSummaryReturn {
  monthlyData: MonthlyEmission[];
  summary: EmissionSummary;
}

// 샘플 데이터를 월별 집계 및 요약으로 가공하는 훅
export const useEmissionSummary = (): UseEmissionSummaryReturn => {
  const monthlyData = useMemo(() => groupByMonth(SAMPLE_EMISSION_RECORDS), []);
  const summary = useMemo(() => summarizeEmissions(SAMPLE_EMISSION_RECORDS), []);

  return { monthlyData, summary };
};
