import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#1a1c1e] text-white',
  secondary: 'bg-[#f3eee5] text-[#1a1c1e]',
  success: 'bg-[#e6f0e8] text-[#4f6b56]',
  warning: 'bg-[#f5ebd7] text-[#a57b37]',
  destructive: 'bg-[#f3e2df] text-[#9b5d56]',
  outline: 'border border-neutral-200 bg-white text-[#1a1c1e]',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
