'use client';

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, AlertCircle, GitBranch, ChevronDown } from 'lucide-react';
import { useEmissionFactors }  from '@/features/emission-factor-crud/hooks/useEmissionFactors';
import { FactorFormModal }     from '@/features/emission-factor-crud/ui/FactorFormModal';
import { useConfirm }          from '@/shared/hooks/useConfirm';
import { Button }              from '@/shared/ui/button';
import { Badge }               from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import type { EmissionFactor, EmissionFactorFormValues } from '@/entities/emission-factor';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  '전기': '#22c55e', '원소재': '#f97316', '운송': '#3b82f6',
  '냉매': '#a855f7', '폐기물': '#ef4444', '기타': '#6b7280',
};
const getCategoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? '#6b7280';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

type ModalMode = 'add' | 'edit' | 'new-version';

export const FactorsPage = () => {
  const { factors, loading, error, add, update, remove, refresh } = useEmissionFactors();
  const { confirm, ConfirmDialog } = useConfirm();

  const [modalOpen, setModalOpen]       = useState(false);
  const [modalMode, setModalMode]       = useState<ModalMode>('add');
  const [editing,   setEditing]         = useState<EmissionFactor | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('전체');

  /* 버전 목록 (최신순) */
  const versions = useMemo(() => {
    const all = Array.from(new Set(factors.map((f) => f.version)));
    return all.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }, [factors]);

  /* 최신 버전 */
  const latestVersion = versions[0] ?? null;

  /* 필터된 목록 */
  const filtered = useMemo(() =>
    selectedVersion === '전체' ? factors : factors.filter((f) => f.version === selectedVersion),
    [factors, selectedVersion],
  );

  function openAdd() {
    setModalMode('add');
    setEditing(null);
    setModalOpen(true);
  }

  function openNewVersion(f: EmissionFactor) {
    setModalMode('new-version');
    setEditing(f);
    setModalOpen(true);
  }

  async function handleEdit(f: EmissionFactor) {
    const ok = await confirm({
      title: '배출계수 수정', message: `"${f.name}" 항목을 수정하시겠습니까?`,
      confirmText: '수정', type: 'warning',
    });
    if (!ok) return;
    setModalMode('edit');
    setEditing(f);
    setModalOpen(true);
  }

  async function handleDelete(f: EmissionFactor) {
    const ok = await confirm({
      title: '배출계수 삭제',
      message: `"${f.name} (${f.version})" 항목을 삭제하면 복구할 수 없습니다.`,
      confirmText: '삭제', type: 'danger',
    });
    if (!ok) return;
    try { await remove(f.id); } catch { /* state reflects error */ }
  }

  async function handleSubmit(values: EmissionFactorFormValues) {
    if (modalMode === 'edit' && editing) {
      await update(editing.id, values);
    } else {
      await add(values);
    }
  }

  /* new-version 시 폼 초기값 — 동일 항목 + 버전만 비움 */
  const formInitial: Partial<EmissionFactorFormValues> | undefined =
    modalMode === 'new-version' && editing
      ? { name: editing.name, category: editing.category, unit: editing.unit, factor: editing.factor, source: editing.source, note: editing.note, version: '' }
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ─── 헤더 ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">배출계수 관리</h1>
              <p className="mt-1 text-sm text-cyan-500">항목·단위·계수를 버전별로 등록·수정·삭제합니다</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refresh}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                title="새로고침"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Button onClick={openAdd} size="sm">
                <Plus className="w-3.5 h-3.5" />새 항목 등록
              </Button>
            </div>
          </div>

          {/* 통계 */}
          {!loading && (
            <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-gray-50">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">전체 항목</p>
                <p className="text-2xl font-extrabold text-gray-900 tabular-nums">{factors.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">버전 수</p>
                <p className="text-2xl font-extrabold text-cyan-600 tabular-nums">{versions.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">최신 버전</p>
                <p className="text-2xl font-extrabold text-gray-900 tabular-nums">{latestVersion ?? '—'}</p>
              </div>
              {Array.from(new Set(factors.map((f) => f.category))).map((cat) => (
                <div key={cat}>
                  <p className="text-xs text-gray-400 mb-0.5">{cat}</p>
                  <p className="text-2xl font-extrabold tabular-nums" style={{ color: getCategoryColor(cat) }}>
                    {factors.filter((f) => f.category === cat).length}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 버전 필터 탭 ─── */}
        {versions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {['전체', ...versions].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVersion(v)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
                  selectedVersion === v
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  v === latestVersion && selectedVersion !== v && 'border-cyan-200 text-cyan-600',
                )}
              >
                {v === latestVersion && v !== '전체' ? `${v} ✦` : v}
              </button>
            ))}
          </div>
        )}

        {/* ─── 테이블 ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 text-sm border-b border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error} — Supabase 연결을 확인하세요.
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <Plus className="w-8 h-8 opacity-30" />
              <p className="text-sm">
                {selectedVersion === '전체'
                  ? '등록된 배출계수가 없습니다.'
                  : `"${selectedVersion}" 버전에 등록된 항목이 없습니다.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>항목명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="text-right">계수</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead>버전</TableHead>
                  <TableHead>출처</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800">{f.name}</p>
                        {f.note && <p className="text-xs text-gray-400 mt-0.5">{f.note}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ color: getCategoryColor(f.category), backgroundColor: `${getCategoryColor(f.category)}15` }}>
                        {f.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-bold text-gray-900">
                      {f.factor}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">{f.unit}</TableCell>
                    <TableCell>
                      <Badge variant={f.version === latestVersion ? 'default' : 'secondary'}
                        className={f.version === latestVersion ? 'bg-cyan-500 text-white border-0' : ''}>
                        {f.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs max-w-[140px] truncate">
                      {f.source || '—'}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">{formatDate(f.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        {/* 새 버전으로 복사 */}
                        <button onClick={() => openNewVersion(f)}
                          className="p-1.5 text-gray-300 hover:text-cyan-500 transition-colors rounded-lg hover:bg-cyan-50"
                          title="새 버전으로 복사"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </button>
                        {/* 수정 */}
                        <button onClick={() => handleEdit(f)}
                          className="p-1.5 text-gray-300 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50"
                          title="수정"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {/* 삭제 */}
                        <button onClick={() => handleDelete(f)}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

      </div>

      {/* 폼 모달 */}
      {modalOpen && (
        <FactorFormModal
          editing={modalMode === 'edit' ? editing : null}
          initialValues={formInitial}
          title={
            modalMode === 'new-version' ? '새 버전으로 복사 등록'
            : modalMode === 'edit'     ? '배출계수 수정'
            :                            '새 배출계수 등록'
          }
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}

      {ConfirmDialog}
    </div>
  );
};
