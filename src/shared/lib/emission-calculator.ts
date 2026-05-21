import type { EmissionRecord, MonthlyEmission, EmissionSummary, ActivityType } from '@/entities/emission';
import { EMISSION_FACTOR_MAP } from '@/shared/config/emission-factors';

// 단일 활동 데이터의 탄소 배출량 계산 (kgCO₂e)
export const calculateEmission = (record: EmissionRecord): number => {
  const factor = EMISSION_FACTOR_MAP[record.description] ?? 0;
  return record.amount * factor;
};

// 배출 데이터를 월별로 집계
export const groupByMonth = (records: EmissionRecord[]): MonthlyEmission[] => {
  const monthMap = new Map<string, MonthlyEmission>();

  records.forEach((record) => {
    const month = record.date.slice(0, 7); // YYYY-MM
    const emission = calculateEmission(record);

    if (!monthMap.has(month)) {
      monthMap.set(month, { month, 전기: 0, 원재료: 0, 이송: 0, 합계: 0 });
    }

    const entry = monthMap.get(month)!;
    entry[record.activityType] += emission;
    entry.합계 += emission;
  });

  // 월 순서대로 정렬
  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
};

// 활동유형별 총 배출량 요약
export const summarizeEmissions = (records: EmissionRecord[]): EmissionSummary => {
  const byType: Record<ActivityType, number> = { 전기: 0, 원재료: 0, 이송: 0 };
  let total = 0;

  records.forEach((record) => {
    const emission = calculateEmission(record);
    byType[record.activityType] += emission;
    total += emission;
  });

  return { total, byType };
};

// 숫자를 소수점 첫째 자리까지 포맷 (예: 1,234.5)
export const formatEmission = (value: number): string =>
  value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
