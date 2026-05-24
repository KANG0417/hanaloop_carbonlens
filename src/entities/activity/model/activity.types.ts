export const ACTIVITY_TYPES = ['전기', '원소재', '운송'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const UNITS = ['kWh', 'MWh', 'mg', 'g', 'kg', 't', 'ton-km', 'km'] as const;
export type Unit = (typeof UNITS)[number];

export const UNITS_BY_TYPE: Record<ActivityType, Unit[]> = {
  '전기':   ['kWh', 'MWh'],
  '원소재': ['mg', 'g', 'kg', 't'],
  '운송':   ['ton-km', 'km'],
};

export const UNIT_LABELS: Record<Unit, string> = {
  'kWh':    'kWh · 킬로와트시',
  'MWh':    'MWh · 메가와트시',
  'mg':     'mg · 밀리그램',
  'g':      'g · 그램',
  'kg':     'kg · 킬로그램',
  't':      't · 톤',
  'ton-km': 'ton-km · 톤킬로미터',
  'km':     'km · 킬로미터',
};

export const DESCRIPTIONS_BY_TYPE: Record<ActivityType, string[]> = {
  '전기':   ['한국전력'],
  '원소재': ['플라스틱 1', '플라스틱 2'],
  '운송':   ['트럭'],
};

/** 각 단위를 기준 단위(kWh 또는 kg)로 환산하는 배율 */
export const UNIT_MULTIPLIERS: Record<Unit, number> = {
  'kWh':    1,
  'MWh':    1000,
  'mg':     0.000001,
  'g':      0.001,
  'kg':     1,
  't':      1000,
  'ton-km': 1,
  'km':     1,
};

/** 기준 단위 기준 배출계수 (kgCO₂e / 기준단위) */
export const EMISSION_FACTORS: Record<string, { factor: number; unit: string }> = {
  '한국전력': { factor: 0.456, unit: 'kgCO₂e/kWh'    },
  '플라스틱 1': { factor: 2.3,   unit: 'kgCO₂e/kg'    },
  '플라스틱 2': { factor: 3.2,   unit: 'kgCO₂e/kg'    },
  '트럭':      { factor: 3.5,   unit: 'kgCO₂e/ton-km' },
};
