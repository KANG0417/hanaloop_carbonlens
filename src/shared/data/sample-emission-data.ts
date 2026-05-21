import type { EmissionRecord } from '@/entities/emission';

// CT-045 컴퓨터 화면 샘플 원시 데이터
export const SAMPLE_EMISSION_RECORDS: EmissionRecord[] = [
  // 전기
  { date: '2025-01-01', activityType: '전기', description: '한국전력', amount: 110, unit: 'kWh' },
  { date: '2025-02-01', activityType: '전기', description: '한국전력', amount: 112, unit: 'kWh' },
  { date: '2025-03-01', activityType: '전기', description: '한국전력', amount: 115, unit: 'kWh' },
  { date: '2025-04-01', activityType: '전기', description: '한국전력', amount: 130, unit: 'kWh' },
  { date: '2025-05-01', activityType: '전기', description: '한국전력', amount: 120, unit: 'kWh' },
  { date: '2025-05-01', activityType: '전기', description: '한국전력', amount: 101, unit: 'kWh' },
  { date: '2025-06-01', activityType: '전기', description: '한국전력', amount: 110, unit: 'kWh' },
  { date: '2025-07-01', activityType: '전기', description: '한국전력', amount: 120, unit: 'kWh' },
  { date: '2025-08-01', activityType: '전기', description: '한국전력', amount: 111, unit: 'kWh' },

  // 원재료
  { date: '2025-01-01', activityType: '원재료', description: '플라스틱 1', amount: 230, unit: 'kg' },
  { date: '2025-02-01', activityType: '원재료', description: '플라스틱 1', amount: 340, unit: 'kg' },
  { date: '2025-03-01', activityType: '원재료', description: '플라스틱 2', amount: 23, unit: 'kg' },
  { date: '2025-03-01', activityType: '원재료', description: '플라스틱 1', amount: 430, unit: 'kg' },
  { date: '2025-04-01', activityType: '원재료', description: '플라스틱 1', amount: 510, unit: 'kg' },
  { date: '2025-05-01', activityType: '원재료', description: '플라스틱 1', amount: 424, unit: 'kg' },
  { date: '2025-05-01', activityType: '원재료', description: '플라스틱 2', amount: 40, unit: 'kg' },
  { date: '2025-05-01', activityType: '원재료', description: '플라스틱 1', amount: 232, unit: 'kg' },
  { date: '2025-06-01', activityType: '원재료', description: '플라스틱 1', amount: 450, unit: 'kg' },
  { date: '2025-07-01', activityType: '원재료', description: '플라스틱 1', amount: 340, unit: 'kg' },
  { date: '2025-07-01', activityType: '원재료', description: '플라스틱 2', amount: 43, unit: 'kg' },
  { date: '2025-08-01', activityType: '원재료', description: '플라스틱 1', amount: 230, unit: 'kg' },

  // 이송
  { date: '2025-01-01', activityType: '이송', description: '트럭', amount: 41, unit: 'ton-km' },
  { date: '2025-02-01', activityType: '이송', description: '트럭', amount: 211, unit: 'ton-km' },
  { date: '2025-03-01', activityType: '이송', description: '트럭', amount: 123, unit: 'ton-km' },
  { date: '2025-04-01', activityType: '이송', description: '트럭', amount: 42, unit: 'ton-km' },
  { date: '2025-05-01', activityType: '이송', description: '트럭', amount: 123, unit: 'ton-km' },
  { date: '2025-05-01', activityType: '이송', description: '트럭', amount: 12, unit: 'ton-km' },
  { date: '2025-06-01', activityType: '이송', description: '트럭', amount: 123, unit: 'ton-km' },
  { date: '2025-07-01', activityType: '이송', description: '트럭', amount: 41, unit: 'ton-km' },
  { date: '2025-08-01', activityType: '이송', description: '트럭', amount: 123, unit: 'ton-km' },
];
