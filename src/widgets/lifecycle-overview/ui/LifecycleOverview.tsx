'use client';

import { PCF_LIFECYCLE_STAGES } from '@/entities/emission';
import type { PcfLifecycleStage } from '@/entities/emission';

interface LifecycleOverviewProps {
  onStageSelect?: (stage: PcfLifecycleStage) => void;
  selectedStageId?: string;
}

const STAGE_DOT: Record<string, string> = {
  '전단계':   '#38bdf8',
  '당해단계': '#22d3ee',
  '후단계':   '#2dd4bf',
};

const STAGE_BADGE: Record<string, string> = {
  '전단계':   'bg-sky-100 text-sky-600',
  '당해단계': 'bg-cyan-100 text-cyan-600',
  '후단계':   'bg-teal-100 text-teal-600',
};

export const LifecycleOverview = ({ onStageSelect, selectedStageId }: LifecycleOverviewProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="mb-5">
      <h3 className="text-base font-bold text-gray-900">전과정 단계별 배출량</h3>
      <p className="text-sm text-cyan-500 mt-0.5">ISO 14067 기준 PCF 5단계 생애주기 · 클릭하면 배출 상세를 확인합니다</p>
    </div>

    <div className="flex items-stretch">
      {PCF_LIFECYCLE_STAGES.map((stage, i) => {
        const isSelected = selectedStageId === stage.id;
        const dot = STAGE_DOT[stage.pcfStage];
        const badge = STAGE_BADGE[stage.pcfStage];

        return (
          <div key={stage.id} className="flex items-stretch flex-1 gap-2">
            <button
              onClick={() => onStageSelect?.(stage)}
              className={`
                flex-1 flex flex-col gap-2 p-4 rounded-xl border text-left
                transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                ${isSelected ? 'shadow-md' : 'border-gray-100 hover:border-gray-200'}
              `}
              style={isSelected ? {
                backgroundColor: `${dot}15`,
                borderColor: dot,
                boxShadow: `0 0 0 2px ${dot}40, 0 4px 12px ${dot}20`,
              } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-300 tracking-widest">{stage.code}</span>
                <span className={`text-sm px-2 py-0.5 rounded-full font-semibold ${badge}`}>
                  {stage.pcfStage}
                </span>
              </div>
              <span className="text-base font-bold text-gray-800 leading-tight">{stage.label}</span>
              <p className="text-sm text-gray-400 leading-relaxed">{stage.description}</p>
              {isSelected && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />
                  <span className="text-xs font-semibold" style={{ color: dot }}>선택됨</span>
                </div>
              )}
            </button>
            {i < PCF_LIFECYCLE_STAGES.length - 1 && (
              <div className="flex items-center text-gray-200 text-xl font-thin shrink-0 select-none">›</div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
