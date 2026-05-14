"use client";

import { useEffect, useState } from 'react';
import { ScanLine, Users, ShieldCheck, ShieldAlert, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

type AuthMeResponse = {
    firstName: string;
    lastName: string;
    role: string;
};

type DashboardData = {
    scansToday: number;
    patientsThisWeek: number;
    prcStatus: string;
    recentPatients: { id: string; firstName: string; lastName: string; accessedAt: string }[];
};

function getInitials(first: string, last: string) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function ProfessionalDashboardPage() {
    const [displayName, setDisplayName] = useState('');
    const [userLoading, setUserLoading] = useState(true);
    const [greeting, setGreeting] = useState('Good day');
    const [dashData, setDashData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        let cancelled = false;

        const loadDashboardData = async () => {
            try {
                const [authRes, dashRes] = await Promise.all([
                    fetch('/api/auth/me', { cache: 'no-store' }),
                    fetch('/api/professional/dashboard', { cache: 'no-store' }),
                ]);

                if (cancelled) return;

                if (authRes.ok) {
                    const data = (await authRes.json()) as AuthMeResponse;
                    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
                    setDisplayName(fullName || 'Professional');
                }

                if (dashRes.ok) {
                    setDashData(await dashRes.json());
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                if (!cancelled) setUserLoading(false);
            }
        };

        void loadDashboardData();
        return () => { cancelled = true; };
    }, []);

    const isVerified = dashData?.prcStatus === 'VERIFIED';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fbf8f2] to-[#f2eae0]">
            {userLoading ? (
                <div className="flex h-screen w-full items-center justify-center">
                    <LunasLoader />
                </div>
            ) : (
                <div className="space-y-10 px-6 py-10 md:px-16 lg:px-20 animate-in fade-in duration-700">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">
                            {greeting}, {displayName.split(' ')[0]}.
                        </h1>
                        <p className="mt-2 text-[#5c6066]">Welcome to your medical portal. Access patient records securely.</p>
                    </div>

                    {/* Count Summary Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Scans Today */}
                        <div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Today</p>
                                    <p className="mt-3 text-4xl font-bold text-[#1a1c1e]">{dashData?.scansToday ?? 0}</p>
                                    <p className="mt-2 text-sm font-medium text-[#5c6066]">Scans Today</p>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0ebe3]">
                                    <ScanLine className="h-5 w-5 text-[#1a1c1e]" />
                                </div>
                            </div>
                        </div>

                        {/* Patients This Week */}
                        <div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">This Week</p>
                                    <p className="mt-3 text-4xl font-bold text-[#1a1c1e]">{dashData?.patientsThisWeek ?? 0}</p>
                                    <p className="mt-2 text-sm font-medium text-[#5c6066]">Patients This Week</p>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0ebe3]">
                                    <Users className="h-5 w-5 text-[#1a1c1e]" />
                                </div>
                            </div>
                        </div>

                        {/* PRC Status */}
                        <div className={`rounded-[2rem] border p-7 shadow-sm ${
                            isVerified
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-amber-200 bg-amber-50'
                        }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        PRC Status
                                    </p>
                                    <p className={`mt-3 text-2xl font-bold ${isVerified ? 'text-emerald-800' : 'text-amber-800'}`}>
                                        {isVerified ? 'Verified' : 'Unverified'}
                                    </p>
                                    <p className={`mt-2 text-sm font-medium ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        {isVerified ? 'License confirmed' : 'Pending verification'}
                                    </p>
                                </div>
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isVerified ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    {isVerified
                                        ? <ShieldCheck className="h-5 w-5 text-emerald-700" />
                                        : <ShieldAlert className="h-5 w-5 text-amber-700" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-blue-900">Secure Patient Access</h3>
                                <p className="mt-1 text-sm text-blue-700">All patient records accessed through this portal are encrypted and logged for compliance. Your access is monitored for patient privacy.</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Patients */}
                    <div className="rounded-[2.5rem] border border-neutral-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-10 pt-10 pb-6">
                            <h2 className="text-2xl font-bold text-[#1a1c1e]">Recent Patients</h2>
                            <a href="/professional/recent-patients" className="text-sm font-medium text-[#8d8374] hover:text-[#1a1c1e] transition-colors flex items-center gap-1">
                                View all <ChevronRight className="h-4 w-4" />
                            </a>
                        </div>
                        {!dashData?.recentPatients?.length ? (
                            <div className="flex flex-col items-center justify-center gap-3 pb-12 pt-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0ebe3]">
                                    <Users className="h-7 w-7 text-[#8d8374]" />
                                </div>
                                <p className="text-sm text-[#8d8374]">No patients scanned yet. Use a patient QR code to get started.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-neutral-100 pb-4">
                                {dashData.recentPatients.map((p) => (
                                    <li key={p.id} className="flex items-center gap-4 px-10 py-4 hover:bg-[#fbf8f2] transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1c1e] text-white text-sm font-bold shrink-0">
                                            {getInitials(p.firstName, p.lastName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[#1a1c1e] truncate">{p.firstName} {p.lastName}</p>
                                            <p className="text-xs text-[#8d8374] mt-0.5 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {timeAgo(p.accessedAt)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
