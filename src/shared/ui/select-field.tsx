import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'appearance-none flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  ),
);
SelectField.displayName = 'SelectField';
