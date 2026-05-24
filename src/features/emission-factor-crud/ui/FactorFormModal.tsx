'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { FACTOR_CATEGORIES } from '@/entities/emission-factor';
import type { EmissionFactor, EmissionFactorFormValues } from '@/entities/emission-factor';
import { Label }       from '@/shared/ui/label';
import { Input }       from '@/shared/ui/input';
import { Button }      from '@/shared/ui/button';
import { SelectField } from '@/shared/ui/select-field';

const schema = z.object({
  name:     z.string().min(1, '항목명을 입력하세요'),
  category: z.string().min(1, '카테고리를 선택하세요'),
  unit:     z.string().min(1, '단위를 입력하세요'),
  factor:   z.number({ error: '숫자를 입력하세요' }).positive('0보다 큰 값이어야 합니다'),
  version:  z.string().min(1, '버전을 입력하세요'),
  source:   z.string(),
  note:     z.string(),
});

const DEFAULT_VALUES: EmissionFactorFormValues = {
  name: '', category: '전기', unit: 'kgCO₂e/kWh',
  factor: undefined as unknown as number,
  version: '', source: '', note: '',
};

interface FactorFormModalProps {
  title?: string;
  editing?: EmissionFactor | null;
  initialValues?: Partial<EmissionFactorFormValues>;
  onSubmit: (values: EmissionFactorFormValues) => Promise<void>;
  onClose: () => void;
}

export const FactorFormModal = ({
  title = '배출계수 등록',
  editing,
  initialValues,
  onSubmit,
  onClose,
}: FactorFormModalProps) => {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<EmissionFactorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name, category: editing.category, unit: editing.unit,
        factor: editing.factor, version: editing.version,
        source: editing.source, note: editing.note,
      });
    } else if (initialValues) {
      reset({ ...DEFAULT_VALUES, ...initialValues });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [editing, initialValues, reset]);

  async function onValid(values: EmissionFactorFormValues) {
    await onSubmit(values);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">

            {/* 항목명 */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="name">항목명</Label>
              <Input id="name" placeholder="예: 한국전력 (계통 전력)"
                {...register('name')} className={errors.name ? 'ring-2 ring-red-400' : ''} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* 카테고리 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">카테고리</Label>
              <SelectField id="category" {...register('category')}>
                {FACTOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </div>

            {/* 버전 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="version">버전</Label>
              <Input id="version" placeholder="예: 2024, v1.2"
                {...register('version')} className={errors.version ? 'ring-2 ring-red-400' : ''} />
              {errors.version && <p className="text-xs text-red-500">{errors.version.message}</p>}
            </div>

            {/* 계수 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="factor">배출계수</Label>
              <Input id="factor" type="number" step="any" min="0" placeholder="0.000"
                {...register('factor', { valueAsNumber: true })}
                className={errors.factor ? 'ring-2 ring-red-400' : ''} />
              {errors.factor && <p className="text-xs text-red-500">{errors.factor.message}</p>}
            </div>

            {/* 단위 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unit">단위</Label>
              <Input id="unit" placeholder="예: kgCO₂e/kWh"
                {...register('unit')} className={errors.unit ? 'ring-2 ring-red-400' : ''} />
              {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
            </div>

            {/* 출처 */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="source">출처 (선택)</Label>
              <Input id="source" placeholder="예: 환경부 온실가스 배출계수 DB (2024)" {...register('source')} />
            </div>

            {/* 비고 */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="note">비고 (선택)</Label>
              <Input id="note" placeholder="추가 설명" {...register('note')} />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>취소</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : title}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
