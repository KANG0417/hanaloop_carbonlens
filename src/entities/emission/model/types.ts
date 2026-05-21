// 활동 유형 유니온 타입
export type ActivityType = '전기' | '원재료' | '이송';

// 원시 배출 활동 데이터
export interface EmissionRecord {
  date: string;
  activityType: ActivityType;
  description: string;
  amount: number;
  unit: string;
}

// 월별 배출량 집계 데이터 (차트용)
export interface MonthlyEmission {
  month: string;
  전기: number;
  원재료: number;
  이송: number;
  합계: number;
}

// 전체 배출량 요약
export interface EmissionSummary {
  total: number;
  byType: Record<ActivityType, number>;
}
