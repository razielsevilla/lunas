"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/ui/LogoutButton';

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/professional/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
      ) 
    },
    { 
      name: 'Scan QR Code', 
      href: '/professional/scan', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M21 9V5a2 2 0 0 0-2-2h-4"/><path d="M3 15v4a2 2 0 0 0 2 2h4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/></svg>
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
    <div className="flex min-h-screen bg-[#F9F7F0]">
      {/* 1. Branding and Header (Midnight Navy Sidebar) */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-8 pb-10 flex items-center space-x-3">
          {/* Dual-circle Logo Icon */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-orange-400 rounded-full"></div>
            <div className="absolute inset-0 bg-white rounded-full translate-x-3 opacity-90 mix-blend-screen"></div>
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-white">Lunas</span>
        </div>

        {/* 2. Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-white/10 text-white' // 3. Selected State Capsule
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* 3. The "Active Indicator" */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                )}
                
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 4. Functional Footer */}
        <div className="p-8 mt-auto border-t border-slate-800/50">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72">
        <div className="p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}