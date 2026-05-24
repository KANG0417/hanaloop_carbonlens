export type {
  GhgEmission,
  PcfStage,
  MonthlyEmissionRow,
  EmissionSummary,
} from './model/emission.types';

export {
  SOURCE_COLORS,
  SOURCE_LABELS,
  getSourceColor,
  getSourceLabel,
  getUniqueSources,
  groupEmissionsByMonth,
  summarizeBySource,
  summarizeBySourceForStage,
} from './model/emission.lib';

export { PCF_LIFECYCLE_STAGES } from './data/scopes';
export type { PcfLifecycleStage } from './data/scopes';
