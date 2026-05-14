"use client";

import { useEffect, useState } from 'react';
import { Users, Clock, ChevronRight } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

type RecentPatient = {
  id: string;
  firstName: string;
  lastName: string;
  accessedAt: string;
};

type DashboardData = {
  recentPatients: RecentPatient[];
  scansToday: number;
  patientsThisWeek: number;
};

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

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

export default function RecentPatientsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/professional/dashboard', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load patient data.');
        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LunasLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const patients = data?.recentPatients ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">Recent Patients</h1>
        <p className="mt-2 text-[#5c6066]">Patients you have accessed in the past 7 days.</p>
      </div>

      {/* Summary pills */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#1a1c1e] shadow-sm">
          <Clock className="h-4 w-4 text-[#8d8374]" />
          <span>{data?.scansToday ?? 0} scan{data?.scansToday !== 1 ? 's' : ''} today</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#1a1c1e] shadow-sm">
          <Users className="h-4 w-4 text-[#8d8374]" />
          <span>{data?.patientsThisWeek ?? 0} unique patient{data?.patientsThisWeek !== 1 ? 's' : ''} this week</span>
        </div>
      </div>

      {/* Patient list */}
      <div className="rounded-[2rem] border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0ebe3]">
              <Users className="h-8 w-8 text-[#8d8374]" />
            </div>
            <div>
              <p className="font-bold text-[#1a1c1e]">No recent patients</p>
              <p className="mt-1 text-sm text-[#8d8374]">
                Patients you scan will appear here.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {patients.map((patient, i) => (
              <li
                key={patient.id}
                className="flex items-center justify-between gap-4 px-7 py-5 hover:bg-[#fbf8f2] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1c1e] text-white text-sm font-bold shrink-0">
                    {getInitials(patient.firstName, patient.lastName)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1c1e]">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-[#8d8374] mt-0.5">
                      Accessed {timeAgo(patient.accessedAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#c4bdb5] shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
