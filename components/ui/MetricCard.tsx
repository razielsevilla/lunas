import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  className?: string;
}

export function MetricCard({ label, value, trend, trendDirection = 'up', className }: MetricCardProps) {
  const isPositive = trendDirection === 'up';

  return (
    <div
      className={cn(
        'rounded-2xl border border-neutral-200 bg-[#fbf8f2] p-6 shadow-[0_24px_70px_rgba(51,43,34,0.05)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a8172]">{label}</p>
          <p className="text-4xl font-semibold tracking-tight text-[#2d2822]">{value}</p>
        </div>

        {trend ? (
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              isPositive ? 'bg-[#e6f0e8] text-[#4f6b56]' : 'bg-[#f3e2df] text-[#9b5d56]',
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span>{trend}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}