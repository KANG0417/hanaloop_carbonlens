'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Database, CheckCircle2 } from 'lucide-react';
import { activityFormSchema, type ActivityFormValues, type ActivityRow } from '@/entities/activity';
import {
  ACTIVITY_TYPES,
  UNITS_BY_TYPE,
  DESCRIPTIONS_BY_TYPE,
  EMISSION_FACTORS,
  UNIT_MULTIPLIERS,
} from '@/entities/activity';
import { Label }       from '@/shared/ui/label';
import { Button }      from '@/shared/ui/button';
import { SelectField } from '@/shared/ui/select-field';
import { Badge }       from '@/shared/ui/badge';
import { DatePicker }  from '@/shared/ui/date-picker';
import { Input }       from '@/shared/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

function calcCo2e(description: string, amount: number, unit: string) {
  const ef = EMISSION_FACTORS[description];
  if (!ef) return null;
  const multiplier = UNIT_MULTIPLIERS[unit as keyof typeof UNIT_MULTIPLIERS] ?? 1;
  return { value: (amount * multiplier * ef.factor / 1000).toFixed(4), unit: 'tCO₂e' };
}

export const ManualEntryTab = () => {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      date: '',
      activityType: '전기',
      description: '한국전력',
      amount: undefined as unknown as number,
      unit: 'kWh',
    },
  });

  const activityType = watch('activityType');
  const descriptions = DESCRIPTIONS_BY_TYPE[activityType] ?? [];
  const units        = UNITS_BY_TYPE[activityType] ?? [];

  function onAdd(data: ActivityFormValues) {
    setRows((prev) => [...prev, data]);
    setSaved(false);
    reset({
      date: '',
      activityType: data.activityType,
      description: descriptions[0] ?? '',
      amount: undefined as unknown as number,
      unit: units[0] ?? 'kWh',
    });
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    // TODO: POST /api/activities
  }

  return (
    <div className="flex flex-col gap-6">

      {/* 입력 폼 카드 */}
      <form onSubmit={handleSubmit(onAdd)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-bold text-gray-700 mb-5">행 추가</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">

          {/* 일자 — 커스텀 캘린더 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">일자</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.date}
                />
              )}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          {/* 활동 유형 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activityType">활동 유형</Label>
            <SelectField
              id="activityType"
              {...register('activityType', {
                onChange: (e) => {
                  const type = e.target.value as typeof ACTIVITY_TYPES[number];
                  setValue('description', DESCRIPTIONS_BY_TYPE[type][0] ?? '');
                  setValue('unit', UNITS_BY_TYPE[type][0] ?? 'kWh');
                },
              })}
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectField>
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">설명</Label>
            <SelectField
              id="description"
              {...register('description')}
              className={errors.description ? 'ring-2 ring-red-400' : ''}
            >
              {descriptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </SelectField>
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* 량 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">량</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              min="0"
              placeholder="0"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'ring-2 ring-red-400' : ''}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          {/* 단위 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unit">단위</Label>
            <SelectField id="unit" {...register('unit')}>
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" size="sm">
            <Plus className="w-3.5 h-3.5" />
            행 추가
          </Button>
        </div>
      </form>

      {/* 입력 목록 */}
      {rows.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">입력된 데이터</span>
              <Badge variant="secondary">{rows.length}행</Badge>
            </div>
            {saved ? (
              <Badge variant="success" className="px-4 py-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />저장 완료
              </Badge>
            ) : (
              <Button onClick={handleSave} variant="success" size="sm">
                <Database className="w-3.5 h-3.5" />
                DB에 저장 ({rows.length}건)
              </Button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>일자</TableHead>
                  <TableHead>활동 유형</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-right">량</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead className="text-right">CO₂e 환산</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => {
                  const co2e = calcCo2e(row.description, row.amount, row.unit);
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{row.date}</TableCell>
                      <TableCell>{row.activityType}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-400">{row.unit}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-cyan-600">
                        {co2e ? `${co2e.value} ${co2e.unit}` : '—'}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => removeRow(idx)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Plus className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-sm">위 폼으로 행을 추가하세요</p>
        </div>
      )}
    </div>
  );
};
