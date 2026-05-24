'use client';

import { useMemo, useState } from 'react';
import { LifecycleOverview } from '@/widgets/lifecycle-overview/ui/LifecycleOverview';
import { EmissionChart } from '@/widgets/emission-chart/ui/EmissionChart';
import { StageDetail } from '@/widgets/stage-detail/ui/StageDetail';
import { CompanyFilter } from '@/features/company-filter/ui/CompanyFilter';
import { YearFilter } from '@/features/year-filter/ui/YearFilter';
import { COMPANIES } from '@/entities/company';
import { COUNTRIES } from '@/entities/country';
import type { PcfLifecycleStage } from '@/entities/emission';

export const DashboardPage = () => {
  // 데이터에서 연도 자동 추출 (새 데이터 추가 시 자동 반영)
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(
      COMPANIES.flatMap((c) => c.emissions.map((e) => parseInt(e.yearMonth.slice(0, 4), 10))),
    )).sort((a, b) => b - a); // 최신순
    return years;
  }, []);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [selectedCompanyId,   setSelectedCompanyId]   = useState<string | null>(null);
  const [selectedYear,        setSelectedYear]        = useState<number>(() => availableYears[0] ?? new Date().getFullYear());
  const [selectedStage,       setSelectedStage]       = useState<PcfLifecycleStage | null>(null);

  const handleStageSelect = (stage: PcfLifecycleStage) =>
    setSelectedStage((prev: PcfLifecycleStage | null) => (prev?.id === stage.id ? null : stage));

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode);
  const selectedCompany = COMPANIES.find((c) => c.id === selectedCompanyId);

  const displayName = selectedCompany?.name
    ?? (selectedCountry ? `${selectedCountry.flag} ${selectedCountry.nameKo}` : '전체');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* 헤더 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">탄소 배출량 대시보드</h1>
              <p className="mt-1 text-sm text-gray-400">
                <span className="font-semibold text-gray-600">{displayName}</span>
                {' · '}{selectedYear}년
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CompanyFilter
                selectedCountryCode={selectedCountryCode}
                selectedCompanyId={selectedCompanyId}
                onCountryChange={setSelectedCountryCode}
                onCompanyChange={setSelectedCompanyId}
              />
              <YearFilter
                years={availableYears}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>
        </div>

        {/* 전과정 5단계 */}
        <LifecycleOverview selectedStageId={selectedStage?.id} onStageSelect={handleStageSelect} />

        {/* 단계 상세 */}
        <StageDetail stage={selectedStage} />

        {/* 월별 배출량 차트 */}
        <EmissionChart />

      </div>
    </div>
  );
};
