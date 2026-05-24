export interface GhgEmission {
  yearMonth: string; // "2025-01"
  source: string;    // electricity, diesel, gasoline, lpg, natural_gas, ...
  emissions: number; // tCO2e
}

export type PcfStage = '전단계' | '당해단계' | '후단계';

export interface MonthlyEmissionRow {
  month: string;
  total: number;
  [source: string]: number | string;
}

export interface EmissionSummary {
  total: number;
  bySource: Record<string, number>;
}
