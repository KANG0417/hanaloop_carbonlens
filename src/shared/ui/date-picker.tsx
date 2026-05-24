'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;           // "YYYY-MM-DD"
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월',
                      '7월', '8월', '9월', '10월', '11월', '12월'];

const CURRENT_YEAR = new Date().getFullYear();

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export const DatePicker = ({
  value, onChange, placeholder = '날짜 선택', className, hasError,
}: DatePickerProps) => {
  const initialMonth = value
    ? parseInt(value.slice(5, 7), 10) - 1
    : new Date().getMonth();

  const [open, setOpen]   = useState(false);
  const [month, setMonth] = useState(initialMonth);
  const ref               = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // value가 바뀌면 표시 월 동기화
  useEffect(() => {
    if (value) setMonth(parseInt(value.slice(5, 7), 10) - 1);
  }, [value]);

  const totalDays  = daysInMonth(CURRENT_YEAR, month);
  const firstDay   = firstDayOfMonth(CURRENT_YEAR, month);
  const todayStr   = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  function select(day: number) {
    onChange(toDateStr(CURRENT_YEAR, month, day));
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn('relative', className)}>

      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-xl border bg-white px-3 text-sm text-left',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
          hasError
            ? 'border-red-400 ring-2 ring-red-400'
            : open
              ? 'border-cyan-400 ring-2 ring-cyan-400/30'
              : 'border-gray-200 hover:border-gray-300',
        )}
      >
        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value || placeholder}
        </span>
      </button>

      {/* 캘린더 팝오버 */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-100/80 p-4 animate-in fade-in-0 zoom-in-95">

          {/* 월 탐색 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setMonth((m) => Math.max(0, m - 1))}
              disabled={month === 0}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <span className="text-sm font-bold text-gray-800 tabular-nums">
              {CURRENT_YEAR}년 &nbsp;{MONTH_LABELS[month]}
            </span>

            <button
              type="button"
              onClick={() => setMonth((m) => Math.min(11, m + 1))}
              disabled={month === 11}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-1">
            {WEEK_DAYS.map((d, i) => (
              <div
                key={d}
                className={cn(
                  'text-center text-xs font-semibold py-1.5',
                  i === 0 ? 'text-rose-400' : i === 6 ? 'text-sky-400' : 'text-gray-400',
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`p${i}`} />)}

            {Array.from({ length: totalDays }).map((_, i) => {
              const day      = i + 1;
              const dateStr  = toDateStr(CURRENT_YEAR, month, day);
              const selected = dateStr === value;
              const isToday  = dateStr === todayStr;
              const col      = (firstDay + i) % 7;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => select(day)}
                  className={cn(
                    'aspect-square w-full flex items-center justify-center rounded-xl text-sm transition-all duration-150 font-medium',
                    selected
                      ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-200 scale-105'
                      : isToday
                        ? 'bg-cyan-50 text-cyan-600 ring-2 ring-cyan-300 font-bold'
                        : col === 0
                          ? 'text-rose-400 hover:bg-rose-50'
                          : col === 6
                            ? 'text-sky-500 hover:bg-sky-50'
                            : 'text-gray-700 hover:bg-gray-100',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* 월 빠른 선택 */}
          <div className="mt-4 pt-3 border-t border-gray-50">
            <p className="text-xs text-gray-400 font-medium mb-2 px-0.5">빠른 이동</p>
            <div className="grid grid-cols-4 gap-1">
              {MONTH_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setMonth(i)}
                  className={cn(
                    'text-xs py-1.5 rounded-lg transition-colors font-medium',
                    month === i
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 연도 고정 안내 */}
          <p className="mt-3 text-center text-xs text-gray-300">{CURRENT_YEAR}년 데이터만 입력 가능합니다</p>
        </div>
      )}
    </div>
  );
};
