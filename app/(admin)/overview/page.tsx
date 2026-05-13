"use client";

import { useEffect, useState, useCallback } from 'react';
import { Activity, ShieldAlert, Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
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
// Toast
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

  const metrics = data
    ? [
        {
          label: 'PATIENTS',
          value: data.stats.totalPatients.toLocaleString(),
          sub: '+213 this week',
        },
        {
          label: 'VERIFIED EXPERTS',
          value: data.stats.totalProfessionals.toLocaleString(),
          sub: `${data.stats.pendingVerifications} pending review`,
        },
        {
          label: 'QR SCANS',
          value: data.stats.totalAccessLogs.toLocaleString(),
          sub: 'All time',
        },
        {
          label: 'UPTIME',
          value: '99.99%',
          sub: 'Last 30 days',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F2EDE6] px-10 py-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="font-serif text-[2.6rem] font-bold tracking-tight text-[#0D152B]">
            System overview
          </h1>
          <p className="mt-2 font-sans text-base text-[#6B7FA3]">
            Live signals across the Lunas platform.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <Loader2 className="h-5 w-5 animate-spin text-[#6B7FA3]" />
            <span className="font-sans text-sm text-[#6B7FA3]">Loading dashboard…</span>
          </div>
        )}

        {!loading && data && (
          <>
            {/* ── Metric Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <article
                  key={m.label}
                  className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm"
                >
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#8FA3C3]">
                    {m.label}
                  </p>
                  <p className="mt-3 font-serif text-4xl font-bold leading-none text-[#0D152B]">
                    {m.value}
                  </p>
                  <p className="mt-2 font-sans text-sm text-[#9AABB8]">{m.sub}</p>
                </article>
              ))}
            </div>

            {/* ── Dashboard Grid ───────────────────────────────────────── */}
            <div className="mt-8 grid gap-6 lg:grid-cols-5">

              {/* Pending Verifications — left, taller card */}
              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 lg:col-span-3">
                <div className="mb-6 flex items-center gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-[#C9A84C]" />
                  <h2 className="font-sans text-lg font-bold text-[#0D152B]">
                    Pending verifications
                  </h2>
                </div>

                {data.recentActivity.length === 0 ? (
                  <p className="font-sans text-sm text-[#94a3b8]">No pending verifications.</p>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {data.recentActivity.slice(0, 5).map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <p className="truncate font-sans text-[0.95rem] font-bold text-[#0D152B]">
                            {entry.professionalName}
                          </p>
                          <p className="font-sans text-xs text-[#9AABB8]">
                            PRC {entry.prcNumber} · {entry.patientName}
                          </p>
                        </div>

                        {/* Sleek Review button */}
                        <button
                          type="button"
                          className="shrink-0 rounded-full border border-[#D4C4A8] bg-white px-5 py-1.5 font-sans text-xs font-semibold text-[#0D152B] transition-colors hover:bg-[#F2EDE6]"
                        >
                          Review
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              {/* Recent System Events — right feed */}
              <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 lg:col-span-2">
                <div className="mb-6 flex items-center gap-2.5">
                  <Activity className="h-5 w-5 text-[#6aa487]" />
                  <h2 className="font-sans text-lg font-bold text-[#0D152B]">
                    Recent system events
                  </h2>
                </div>

                <ul className="space-y-4">
                  {data.recentActivity.map((event) => (
                    <li key={event.id} className="flex flex-col gap-0.5">
                      {/* Monospace-style event type tag */}
                      <span className="inline-block w-fit rounded bg-[#EEE8DF] px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-[#7A6B55]">
                        {event.status}
                      </span>
                      <p className="font-mono text-[12px] text-[#8d8374]">
                        {new Date(event.accessedAt).toLocaleString()} · {event.professionalName}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>

            </div>
          </>
        )}
      </div>

      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}