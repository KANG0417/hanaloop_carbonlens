export const ACTIVITY_TYPES = ['전기', '원소재', '운송'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const UNITS = ['kWh', 'MWh', 'g', 'kg', 't', 'ton-km'] as const;
export type Unit = (typeof UNITS)[number];

export const UNITS_BY_TYPE: Record<ActivityType, Unit[]> = {
  '전기':   ['kWh', 'MWh'],
  '원소재': ['g', 'kg', 't'],
  '운송':   ['ton-km'],
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
  'g':      0.001,
  'kg':     1,
  't':      1000,
  'ton-km': 1,
};

/** 기준 단위 기준 배출계수 (kgCO₂e / 기준단위) */
export const EMISSION_FACTORS: Record<string, { factor: number; unit: string }> = {
  '한국전력': { factor: 0.456, unit: 'kgCO₂e/kWh'    },
  '플라스틱 1': { factor: 2.3,   unit: 'kgCO₂e/kg'    },
  '플라스틱 2': { factor: 3.2,   unit: 'kgCO₂e/kg'    },
  '트럭':      { factor: 3.5,   unit: 'kgCO₂e/ton-km' },
};
