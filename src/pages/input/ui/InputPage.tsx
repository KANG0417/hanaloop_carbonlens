'use client';

import { useState } from 'react';
import { FileSpreadsheet, PenLine, Zap, Package, Truck, type LucideIcon } from 'lucide-react';
import { ExcelUploadTab } from '@/features/activity-import/ui/ExcelUploadTab';
import { ManualEntryTab } from '@/features/activity-import/ui/ManualEntryTab';
import { cn } from '@/lib/utils';

interface EmissionFactorCard {
  category: string;
  description: string;
  factor: string;
  unit: string;
  color: string;
  Icon: LucideIcon;
}

const EMISSION_FACTOR_CARDS: EmissionFactorCard[] = [
  {
    category:    '전기',
    description: '한국전력 (계통 전력)',
    factor:      '0.456',
    unit:        'kgCO₂e/kWh  ·  456 kgCO₂e/MWh',
    color:       '#22c55e',
    Icon:        Zap,
  },
  {
    category:    '원소재',
    description: '플라스틱 1 (PP/PE계)',
    factor:      '2.3',
    unit:        'kgCO₂e/kg  ·  0.0023 kgCO₂e/g  ·  2,300 kgCO₂e/t',
    color:       '#f97316',
    Icon:        Package,
  },
  {
    category:    '원소재',
    description: '플라스틱 2 (ABS/PC계)',
    factor:      '3.2',
    unit:        'kgCO₂e/kg  ·  0.0032 kgCO₂e/g  ·  3,200 kgCO₂e/t',
    color:       '#a855f7',
    Icon:        Package,
  },
  {
    category:    '운송',
    description: '트럭 (도로 화물)',
    factor:      '3.5',
    unit:        'kgCO₂e/ton-km',
    color:       '#3b82f6',
    Icon:        Truck,
  },
];

const TABS = [
  { id: 'excel',  label: '엑셀 업로드', icon: FileSpreadsheet },
  { id: 'manual', label: '수동 입력',   icon: PenLine },
] as const;

type TabId = (typeof TABS)[number]['id'];

export const InputPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('excel');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* 헤더 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">데이터 관리</h1>
          <p className="mt-1 text-sm text-gray-400">활동 데이터를 입력하거나 엑셀 파일로 일괄 가져올 수 있습니다</p>

          {/* 배출계수 참고 */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">배출계수 기준표</span>
              <span className="text-xs text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-full px-2.5 py-0.5 font-semibold">
                출처: 환경부 온실가스 배출계수 DB (2024)
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {EMISSION_FACTOR_CARDS.map((card) => (
                <div
                  key={card.description}
                  className="flex items-start gap-3 rounded-xl border p-3.5 transition-shadow hover:shadow-sm"
                  style={{ borderColor: `${card.color}30`, backgroundColor: `${card.color}08` }}
                >
                  <div
                    className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <card.Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{card.description}</p>
                    <p className="text-xs font-semibold" style={{ color: card.color }}>{card.category}</p>
                    <p className="text-sm font-extrabold tabular-nums mt-0.5" style={{ color: card.color }}>
                      {card.factor}
                      <span className="text-xs font-normal text-gray-400 ml-1">{card.unit}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-100">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px',
                  activeTab === id
                    ? 'text-cyan-600 border-cyan-500 bg-cyan-50/40'
                    : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'excel'  && <ExcelUploadTab />}
            {activeTab === 'manual' && <ManualEntryTab />}
          </div>
        </div>

      </div>
    </div>
  );
};
