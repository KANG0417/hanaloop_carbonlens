'use client';

import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Database } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { parseExcelFile, type ParsedRow } from '../lib/parseExcel';
import { EMISSION_FACTORS } from '@/entities/activity';

function calcCo2e(description: string, amount: number): string {
  const ef = EMISSION_FACTORS[description];
  if (!ef) return '—';
  return `${(amount * ef.factor / 1000).toFixed(4)} tCO₂e`;
}

export const ExcelUploadTab = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows]       = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [dragging, setDragging] = useState(false);

  const validRows   = rows.filter((r) => r.data !== null);
  const invalidRows = rows.filter((r) => r.data === null);

  async function handleFile(file: File) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert('.xlsx / .xls / .csv 파일만 업로드할 수 있습니다.');
      return;
    }
    setLoading(true);
    setSaved(false);
    setFileName(file.name);
    try {
      const parsed = await parseExcelFile(file);
      setRows(parsed);
    } finally {
      setLoading(false);
    }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSave() {
    setSaved(true);
    // TODO: POST to /api/activities
  }

  return (
    <div className="flex flex-col gap-6">

      {/* 드롭존 */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer
          transition-all duration-200
          ${dragging
            ? 'border-cyan-400 bg-cyan-50'
            : 'border-gray-200 bg-gray-50/50 hover:border-cyan-300 hover:bg-cyan-50/30'
          }
        `}
      >
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileInput} />
        <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center">
          <FileSpreadsheet className="w-6 h-6 text-cyan-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {loading ? '파싱 중...' : '엑셀 파일을 드래그하거나 클릭해서 업로드'}
          </p>
          <p className="text-xs text-gray-400 mt-1">.xlsx · .xls · .csv 지원</p>
        </div>
        {!loading && (
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            <Upload className="w-3.5 h-3.5" />
            파일 선택
          </Button>
        )}
      </div>

      {/* 결과 요약 */}
      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">{fileName}</span>
              <Badge variant="secondary">{rows.length}행</Badge>
              <Badge variant="success">
                <CheckCircle2 className="w-3 h-3" />
                유효 {validRows.length}
              </Badge>
              {invalidRows.length > 0 && (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3" />
                  오류 {invalidRows.length}
                </Badge>
              )}
            </div>
            {validRows.length > 0 && (
              saved ? (
                <Badge variant="success" className="px-4 py-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  저장 완료
                </Badge>
              ) : (
                <Button onClick={handleSave} variant="success" size="sm">
                  <Database className="w-3.5 h-3.5" />
                  DB에 저장 ({validRows.length}건)
                </Button>
              )
            )}
          </div>

          {/* 미리보기 테이블 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>일자</TableHead>
                  <TableHead>활동 유형</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-right">량</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead className="text-right">CO₂e 환산</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) =>
                  row.data ? (
                    <TableRow key={row.rowIndex}>
                      <TableCell className="text-gray-400">{row.rowIndex}</TableCell>
                      <TableCell className="font-mono text-xs">{row.data.date}</TableCell>
                      <TableCell>{row.data.activityType}</TableCell>
                      <TableCell>{row.data.description}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.data.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-400">{row.data.unit}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-cyan-600">
                        {calcCo2e(row.data.description, row.data.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3" />유효
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={row.rowIndex} className="bg-red-50/30">
                      <TableCell className="text-gray-400">{row.rowIndex}</TableCell>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col gap-0.5">
                          {row.errors.map((e, i) => (
                            <p key={i} className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />{e}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3" />오류
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
