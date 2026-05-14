"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/ui/LogoutButton';

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (pathname === href) {
      return true;
    }

    return pathname.startsWith(href + '/');
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/professional/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      ) 
    },

    { 
      name: 'Recent Patients', 
      href: '/professional/recent-patients', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ) 
    },
    { 
      name: 'My Profile', 
      href: '/professional/profile', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/><path d="M10 22v-6.5h4V22"/><path d="M4.5 9.3c.5-2.4 2.1-3 4.5-3s4 1.1 4.5 3.5"/><path d="M17 11c.3-3 .8-4.9 2-4.9s1.7 1.9 2 4.9"/><path d="M3 12h18M9 21h6"/></svg>
      ) 
    },
  ];

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
          {navItems.map((item) => {
            const isActive = isActiveLink(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
                )}
                <span className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="min-h-screen md:pl-72">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
          <div className="flex-1 px-10 py-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}