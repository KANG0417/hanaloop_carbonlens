'use client';

import Image from 'next/image';
import hanaloopLogo from '@/assets/images/hanaloop_logo.jpg';
import { EmissionSummaryCard, EmissionStackedChart, useEmissionSummary } from '@/features/emission-chart';
import { ACTIVITY_TYPE_COLORS } from '@/shared/config/emission-factors';
import type { ActivityType } from '@/entities/emission';

const SUMMARY_CARD_CONFIG: { key: ActivityType | 'total'; label: string; color: string }[] = [
  { key: 'total', label: '총 배출량', color: '#1f2937' },
  { key: '전기', label: '전기', color: ACTIVITY_TYPE_COLORS['전기'] },
  { key: '원재료', label: '원재료', color: ACTIVITY_TYPE_COLORS['원재료'] },
  { key: '이송', label: '이송', color: ACTIVITY_TYPE_COLORS['이송'] },
];

export const EmissionDashboard = () => {
  const { monthlyData, summary } = useEmissionSummary();

  const getValue = (key: ActivityType | 'total'): number =>
    key === 'total' ? summary.total : summary.byType[key];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">탄소 배출량 대시보드</h1>
        <p className="mt-1 text-sm text-gray-400">CT-045 · 컴퓨터 화면 · 2025년 1월 ~ 8월</p>
      </div>

      {/* 브랜드 이미지 */}
      <section className="w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
        <Image
          src={hanaloopLogo}
          alt="Hanaloop 로고"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority
          unoptimized
        />
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUMMARY_CARD_CONFIG.map(({ key, label, color }) => (
          <EmissionSummaryCard
            key={key}
            label={label}
            value={getValue(key)}
            color={color}
          />
        ))}
      </section>

      {/* 월별 누적 막대 차트 */}
      <section>
        <EmissionStackedChart data={monthlyData} />
      </section>
    </main>
  );
};
