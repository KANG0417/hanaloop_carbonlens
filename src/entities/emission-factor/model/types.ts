export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  unit: string;
  factor: number;
  version: string;
  source: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface EmissionFactorFormValues {
  name: string;
  category: string;
  unit: string;
  factor: number;
  version: string;
  source: string;
  note: string;
}

export const FACTOR_CATEGORIES = ['전기', '원소재', '운송', '냉매', '폐기물', '기타'] as const;
