import type { ActivityType } from '@/entities/emission';

// 품목별 배출계수 (kgCO₂e / 단위)
export const EMISSION_FACTOR_MAP: Record<string, number> = {
  '한국전력': 0.456,  // kgCO₂e / kWh
  '플라스틱 1': 2.3,  // kgCO₂e / kg
  '플라스틱 2': 3.2,  // kgCO₂e / kg
  '트럭': 3.5,        // kgCO₂e / ton-km
};

// 활동유형별 차트 색상
export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  '전기': '#22c55e',
  '원재료': '#3b82f6',
  '이송': '#f97316',
};
