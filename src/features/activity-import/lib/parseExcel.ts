import * as XLSX from 'xlsx';
import { activityRowSchema } from '@/entities/activity';
import type { ActivityRow } from '@/entities/activity';

export interface ParsedRow {
  rowIndex: number;
  data: ActivityRow | null;
  errors: string[];
}

const HEADER_MAP: Record<string, keyof ActivityRow> = {
  '일자(원본)': 'date',
  '일자':       'date',
  '활동 유형':  'activityType',
  '활동유형':   'activityType',
  '설명':       'description',
  '량':         'amount',
  '단위':       'unit',
};

function resolveHeaders(headerRow: unknown[]): (keyof ActivityRow | null)[] {
  return headerRow.map((h) => HEADER_MAP[String(h ?? '').trim()] ?? null);
}

export async function parseExcelFile(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

  if (rows.length < 2) return [];

  const keys = resolveHeaders(rows[0]);
  const dataRows = rows.slice(1).filter((r) => r.some((c) => c !== null && c !== undefined && c !== ''));

  return dataRows.map((row, i): ParsedRow => {
    const raw: Record<string, unknown> = {};
    keys.forEach((key, colIdx) => {
      if (key) raw[key] = row[colIdx];
    });

    // Normalize date: Excel sometimes returns Date object or "2025/01/01"
    if (raw.date instanceof Date) {
      raw.date = raw.date.toISOString().slice(0, 10);
    } else if (typeof raw.date === 'string') {
      raw.date = raw.date.trim().replace(/\//g, '-');
    }

    const result = activityRowSchema.safeParse(raw);
    if (result.success) {
      return { rowIndex: i + 2, data: result.data, errors: [] };
    }
    const errors = result.error.issues.map(
      (e) => `[${String(e.path[0] ?? '필드')}] ${e.message}`,
    );
    return { rowIndex: i + 2, data: null, errors };
  });
}
