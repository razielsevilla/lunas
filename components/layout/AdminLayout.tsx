"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
        'group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
      )}
      <Icon
        className={cn(
          'h-5 w-5 transition-colors',
          active ? 'text-white' : 'text-white/40 group-hover:text-white'
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminLayout({ children, activePath }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    const currentPath = activePath ?? pathname;

    if (currentPath === href) {
      return true;
    }

    return currentPath.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#1a1c1e]">
      <aside
        className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-[#0f172a] px-6 py-8 md:flex"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(74,85,104,0.45) 1.2px, transparent 1.2px)',
          backgroundSize: '18px 18px',
        }}
      >

        <div className="flex items-center gap-3 px-2 pb-10">
          <Image
            src="/logo/lunas-logo.png"
            alt="Lunas Logo"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <h1 className="text-2xl font-serif font-bold tracking-tight text-white">Lunas</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              active={isActiveLink(item.href)}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="min-h-screen md:pl-72">{children}</main>
    </div>
  );
}