import { cn } from '@/lib/cn';

export type StatusVariant = 'Active' | 'Pending' | 'Suspended' | 'Denied' | 'Success' | 'Verified';

export interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  Active: 'bg-[#e6f0e8] text-[#4f6b56] ring-[#b8ccb9]/70',
  Pending: 'bg-[#f5ebd7] text-[#a57b37] ring-[#e6d0a6]/80',
  Suspended: 'bg-[#f0ebdf] text-[#7f715b] ring-[#d8cbb1]/80',
  Denied: 'bg-[#f3e2df] text-[#9b5d56] ring-[#dfbab6]/80',
  Success: 'bg-[#e4efe7] text-[#4f745c] ring-[#b6cdbb]/70',
  Verified: 'bg-[#e8edf3] text-[#5f7182] ring-[#c5d0dc]/80',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ring-1 ring-inset',
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}