import Link from 'next/link';
import { 
  LayoutDashboard, 
  UserCircle, 
  QrCode, 
  History, 
  type LucideIcon 
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
  { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'My Medical Profile', href: '/patient/profile', icon: UserCircle },
  { label: 'My QR Code', href: '/patient/qr-code', icon: QrCode },
  { label: 'Access Logs', href: '/patient/access-logs', icon: History },
];

export interface PatientLayoutProps {
  children: ReactNode;
  activePath?: string;
  displayName?: string;
  roleLabel?: string;
  avatarInitials?: string;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MS';
}

function NavigationLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/60 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon className={cn('h-5 w-5 transition-colors', active ? 'text-white' : 'text-white/40 group-hover:text-white')} />
      <span>{item.label}</span>
    </Link>
  );
}

export function PatientLayout({
  children,
  activePath,
  displayName = 'Maria Santos',
  roleLabel = 'Patient',
  avatarInitials,
}: PatientLayoutProps) {
  const resolvedInitials = avatarInitials ?? getInitials(displayName);

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#1a1c1e]">
      {/* Sidebar - Matching dark aesthetic from screenshot */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-[#0f172a] px-6 py-8 md:flex">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 pb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-200 to-amber-500">
             {/* Simple shape to represent the logo in the screenshot */}
             <div className="h-6 w-6 rounded-full bg-[#0f172a]/20 backdrop-blur-sm" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Lunas</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => (
            <NavigationLink 
              key={item.href} 
              item={item} 
              active={activePath === item.href} 
            />
          ))}
        </nav>

        {/* Logout Section at the bottom */}
        <div className="mt-auto border-t border-white/10 pt-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-h-screen md:pl-72">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
          {/* Header Bar */}
          <header className="flex items-center justify-end bg-white/50 px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-[#1a1c1e]">{displayName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">{roleLabel}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1c1e] text-xs font-bold text-white">
                {resolvedInitials}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 px-8 py-8 lg:px-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}