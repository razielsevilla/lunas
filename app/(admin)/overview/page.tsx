"use client";

import { useEffect, useState, useCallback } from 'react';
import { Activity, ShieldAlert, Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types matching GET /api/admin/overview response
// ---------------------------------------------------------------------------

type OverviewStats = {
  totalPatients: number;
  totalProfessionals: number;
  pendingVerifications: number;
  totalAccessLogs: number;
};

type RecentActivityEntry = {
  id: string;
  accessedAt: string;
  status: string;
  patientName: string;
  professionalName: string;
  prcNumber: string;
};

type OverviewData = {
  stats: OverviewStats;
  recentActivity: RecentActivityEntry[];
};

// ---------------------------------------------------------------------------
// Toast helper (lightweight inline toast)
// ---------------------------------------------------------------------------
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-red-200 bg-white px-6 py-4 shadow-lg">
      <p className="font-sans text-sm text-red-600">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json: OverviewData = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load overview data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  // Derive display metrics from live data
  const metrics = data
    ? [
        { label: 'PATIENTS', value: data.stats.totalPatients.toLocaleString(), note: 'Total registered' },
        { label: 'VERIFIED EXPERTS', value: data.stats.totalProfessionals.toLocaleString(), note: `${data.stats.pendingVerifications} pending review` },
        { label: 'ACCESS LOGS', value: data.stats.totalAccessLogs.toLocaleString(), note: 'All time' },
        { label: 'PENDING REVIEWS', value: data.stats.pendingVerifications.toString(), note: 'Awaiting approval' },
      ]
    : [];

  return (
    <div className="space-y-10 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            System overview
          </h1>
          <p className="mt-3 font-sans text-lg text-[#64748b]">
            Live signals across the Lunas platform.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#64748b]" />
            <span className="font-sans text-sm text-[#64748b]">Loading dashboard…</span>
          </div>
        )}

        {/* Populated State */}
        {!loading && data && (
          <>
            {/* Primary Metric Row */}
            <div className="mt-6 flex justify-center">
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="m-2 flex min-h-[116px] flex-col justify-center rounded-2xl border border-neutral-200 bg-[#FDF9F3] px-6 py-4"
                  >
                    <p className="font-sans text-xs font-medium uppercase tracking-wider text-[#355070]">{metric.label}</p>
                    <p className="mt-2 font-serif text-3xl font-bold leading-tight text-[#0D152B]">{metric.value}</p>
                    <p className="mt-2 text-sm text-[#556f94]">{metric.note}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Functional Dashboard Grid */}
            <div className="mt-10 grid gap-8 lg:grid-cols-5">
              {/* 1. Pending Verifications (Left Column) */}
              <article className="rounded-2xl border border-neutral-200 bg-white p-8 lg:col-span-3">
                <div className="mb-8 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#f59e0b]" />
                  <h2 className="font-sans text-xl font-bold text-[#0D152B]">
                    Pending verifications
                  </h2>
                </div>

                {data.recentActivity.length === 0 ? (
                  <p className="font-sans text-sm text-[#94a3b8]">No pending verifications.</p>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {data.recentActivity.slice(0, 5).map((entry) => (
                      <li key={entry.id} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-sans text-[1.05rem] font-bold text-[#0D152B]">
                            {entry.professionalName}
                          </p>
                          <p className="font-sans text-sm text-[#94a3b8]">
                            PRC {entry.prcNumber} · Patient: {entry.patientName}
                          </p>
                        </div>

                        <span className="rounded-full border border-neutral-200 bg-white px-5 py-1.5 text-sm font-medium text-[#0D152B]">
                          {entry.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              {/* 2. Recent System Events (Right Column) */}
              <article className="rounded-2xl border border-neutral-200 bg-white p-8 lg:col-span-2">
                <div className="mb-8 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#10b981]" />
                  <h2 className="font-sans text-xl font-bold text-[#0D152B]">
                    Recent activity
                  </h2>
                </div>

                <ul className="space-y-6">
                  {data.recentActivity.map((event) => (
                    <li key={event.id} className="flex flex-col space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans text-sm font-bold text-[#0D152B]">
                          {event.professionalName}
                        </span>
                        <span className="font-sans text-[0.8rem] text-[#94a3b8]">
                          · {new Date(event.accessedAt).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </>
        )}
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}