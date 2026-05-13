import Link from 'next/link';
import { Activity, ClipboardList, LayoutDashboard, ShieldCheck, Sparkles, Users, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { LogoutButton } from '@/components/ui/LogoutButton';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Expert Verifications', href: '/expert-verifications', icon: ShieldCheck },
  { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
  { label: 'System Health', href: '/system-health', icon: Activity },
];

export interface AdminLayoutProps {
  children: ReactNode;
  activePath?: string;
}

function NavigationLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'border-[#d8c8b1] bg-white text-[#2d2822] shadow-[0_10px_30px_rgba(51,43,34,0.05)]'
          : 'border-transparent text-[#7d7264] hover:border-[#e0d5c5] hover:bg-white/70 hover:text-[#2d2822]',
      )}
    >
      <Icon className={cn('h-4 w-4 transition-colors', active ? 'text-[#6f7d65]' : 'text-[#9b9081] group-hover:text-[#6f7d65]')} />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminLayout({ children, activePath }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#2d2822]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-80 border-r border-neutral-200 bg-[#f8f3ea]/95 px-6 py-7 backdrop-blur md:flex md:flex-col">
        <div className="flex items-center gap-3 px-2 pb-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(51,43,34,0.05)]">
            <Sparkles className="h-5 w-5 text-[#6f7d65]" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#8d8374]">Lunas</p>
            <h1 className="text-lg font-semibold tracking-tight text-[#2d2822]">Admin Console</h1>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => (
            <NavigationLink key={item.href} item={item} active={activePath ? activePath === item.href : false} />
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-neutral-200 pt-4 mb-4">
          <LogoutButton className="text-[#7d7264] hover:text-[#2d2822] [&_svg]:text-[#9b9081] [&_svg]:hover:text-[#2d2822]" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_18px_48px_rgba(51,43,34,0.05)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8d8374]">Workspace</p>
          <p className="mt-2 text-sm leading-6 text-[#4d463d]">
            A quiet, cream-toned system surface for operational dashboards and review workflows.
          </p>
        </div>
      </aside>

      <main className="min-h-screen md:pl-80">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-neutral-200 bg-[#fbf8f2] px-5 py-4 shadow-[0_18px_48px_rgba(51,43,34,0.04)]">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#8d8374]">Operations</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#2d2822]">Luxury Minimal Admin</h2>
            </div>
            <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#7d7264]">
              Stable
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}