import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

// 폼 전용 스키마 — react-hook-form의 valueAsNumber가 이미 숫자로 변환하므로 z.number() 사용
export const activityFormSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식: YYYY-MM-DD')
    .refine(
      (d) => parseInt(d.slice(0, 4), 10) <= CURRENT_YEAR,
      `${CURRENT_YEAR}년 이하의 날짜만 입력 가능합니다`,
    )
    .refine(
      (d) => new Date(d) <= new Date(`${CURRENT_YEAR}-12-31`),
      `${CURRENT_YEAR}년 12월 31일까지만 입력 가능합니다`,
    ),
  activityType: z.enum(['전기', '원소재', '운송'], {
    error: '전기 · 원소재 · 운송 중 하나여야 합니다',
  }),
  description: z.string().min(1, '설명을 입력하세요'),
  amount: z
    .number({ error: '숫자를 입력하세요' })
    .positive('0보다 큰 값이어야 합니다'),
  unit: z.enum(['kWh', 'MWh', 'g', 'kg', 't', 'ton-km'], {
    error: 'kWh · MWh · g · kg · t · ton-km 중 하나여야 합니다',
  }),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

// Excel/CSV 파서용 스키마 — 셀 값이 문자열이므로 z.coerce 사용
export const activityRowSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식: YYYY-MM-DD')
    .refine(
      (d) => parseInt(d.slice(0, 4), 10) <= CURRENT_YEAR,
      `${CURRENT_YEAR}년 이하의 날짜만 입력 가능합니다`,
    )
    .refine(
      (d) => new Date(d) <= new Date(`${CURRENT_YEAR}-12-31`),
      `${CURRENT_YEAR}년 12월 31일까지만 입력 가능합니다`,
    ),
  activityType: z.enum(['전기', '원소재', '운송'], {
    error: '전기 · 원소재 · 운송 중 하나여야 합니다',
  }),
  description: z.string().min(1, '설명을 입력하세요'),
  amount: z.coerce
    .number({ error: '숫자를 입력하세요' })
    .positive('0보다 큰 값이어야 합니다'),
  unit: z.enum(['kWh', 'MWh', 'g', 'kg', 't', 'ton-km'], {
    error: 'kWh · MWh · g · kg · t · ton-km 중 하나여야 합니다',
  }),
});

export type ActivityRow = z.infer<typeof activityRowSchema>;
