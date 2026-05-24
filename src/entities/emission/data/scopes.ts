import type { PcfStage } from '../model/emission.types';

// Fraction of each source's total emissions attributed to each PCF stage.
// Rows sum to 1.0 per source across A1+A2+A3+B+C.
export const STAGE_RATIOS: Record<string, Record<string, number>> = {
  A1: { electricity: 0.03, diesel: 0.15, gasoline: 0.05, natural_gas: 0.30, lpg: 0.10 },
  A2: { electricity: 0.02, diesel: 0.45, gasoline: 0.50, natural_gas: 0.05, lpg: 0.08 },
  A3: { electricity: 0.70, diesel: 0.25, gasoline: 0.15, natural_gas: 0.55, lpg: 0.65 },
  B:  { electricity: 0.20, diesel: 0.08, gasoline: 0.25, natural_gas: 0.07, lpg: 0.12 },
  C:  { electricity: 0.05, diesel: 0.07, gasoline: 0.05, natural_gas: 0.03, lpg: 0.05 },
};

export interface PcfLifecycleStage {
  id: string;
  code: string;
  label: string;
  pcfStage: PcfStage;
  description: string;
}

export const PCF_LIFECYCLE_STAGES: PcfLifecycleStage[] = [
  {
    id: 'A1',
    code: 'A1',
    label: '원료 취득',
    pcfStage: '전단계',
    description: '원재료 채굴 및 조달 단계',
  },
  {
    id: 'A2',
    code: 'A2',
    label: '원료 이송',
    pcfStage: '전단계',
    description: '원재료를 생산 공장으로 운반하는 단계',
  },
  {
    id: 'A3',
    code: 'A3',
    label: '제조',
    pcfStage: '당해단계',
    description: '제품 생산 및 조립 공정',
  },
  {
    id: 'B',
    code: 'B',
    label: '사용',
    pcfStage: '후단계',
    description: '소비자 사용 단계에서 발생하는 배출',
  },
  {
    id: 'C',
    code: 'C',
    label: '폐기',
    pcfStage: '후단계',
    description: '제품 폐기 및 재활용 처리 단계',
  },
];
