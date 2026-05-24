'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning';
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      setState({ ...options, resolve });
    });
  }

  function close(value: boolean) {
    state?.resolve(value);
    setState(null);
  }

  const ConfirmDialog = state ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => close(false)}
      />

      {/* 다이얼로그 */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-sm mx-4">
        {/* 아이콘 */}
        <div className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
          state.type === 'danger' ? 'bg-red-50' : 'bg-amber-50',
        )}>
          {state.type === 'danger'
            ? <Trash2 className="w-5 h-5 text-red-500" />
            : <AlertTriangle className="w-5 h-5 text-amber-500" />
          }
        </div>

        <h3 className="text-base font-extrabold text-gray-900 mb-1.5">{state.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">{state.message}</p>

        <div className="flex gap-2">
          <button
            onClick={() => close(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => close(true)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors',
              state.type === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-amber-500 hover:bg-amber-600',
            )}
          >
            {state.confirmText ?? '확인'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
}
