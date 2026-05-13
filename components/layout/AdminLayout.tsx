"use client";

import Link from 'next/link';
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LogoutButton } from '@/components/ui/LogoutButton';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavItem[] = [
  { label: 'Overview',            href: '/overview',            icon: LayoutDashboard },
  { label: 'Users',               href: '/users',               icon: Users           },
  { label: 'Expert Verifications',href: '/verifications',       icon: ShieldCheck     },
  { label: 'Audit Logs',          href: '/audit-logs',          icon: ClipboardList   },
  { label: 'System Health',       href: '/system-health',       icon: Activity        },
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
        'group relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-[#1A2235] text-white' // Active state
          : 'text-[#7A93B4] hover:bg-[#1A2235] hover:text-white' // Hover state (background/text only)
      )}
    >
      {/* Vertical golden accent line — ONLY visible and glowing when active */}
      {active && (
        <span className="absolute left-0 top-1/2 h-[44%] w-[3px] -translate-y-1/2 rounded-r-full bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
      )}

      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
          active ? 'text-white' : 'text-[#7A93B4] group-hover:text-white'
        )}
        strokeWidth={1.5}
      />
      <span className="font-sans tracking-wide">{item.label}</span>
    </Link>
  );
}

export function AdminLayout({ children, activePath }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F2EDE6] text-[#0D152B]">
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[256px] flex-col bg-[#0B1623] md:flex">

        {/* Brand */}
        <div className="flex items-center gap-3 px-7 pb-8 pt-10">
          {/* Logo: golden crescent circle overlapping a white circle */}
          <div className="relative flex h-7 w-10 shrink-0 items-center">
            <div className="absolute left-0 h-6 w-6 rounded-full bg-[#C9A84C]" />
            <div className="absolute left-[11px] h-6 w-6 rounded-full bg-white shadow-[0_0_14px_rgba(201,168,76,0.2)]" />
          </div>
          <h1 className="font-serif text-[1.6rem] font-bold tracking-tight text-white">
            Lunas
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-4 pt-2">
          {navigation.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              active={activePath ? activePath === item.href : false}
            />
          ))}
        </nav>

        {/* Log Out footer */}
        <div className="mt-auto border-t border-[#19283C] px-4 py-6">
          <div className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-[#7A93B4] transition-all duration-200 hover:bg-[#1A2235] hover:text-white">
            <LogoutButton className="flex w-full items-center gap-4 text-inherit" />
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="flex-1 md:pl-[256px]">
        {children}
      </main>
    </div>
  );
}