"use client";

import { Activity, ShieldAlert } from 'lucide-react';

const metrics = [
  { label: 'PATIENTS', value: '12,840', note: '+213 this week' },
  { label: 'VERIFIED EXPERTS', value: '487', note: '9 pending review' },
  { label: 'QR SCANS (24H)', value: '1,322', note: '3 emergency' },
  { label: 'UPTIME', value: '99.98%', note: '30-day rolling' },
];

const pendingVerifications = [
  { name: 'Dr. Andrea Lim', title: 'Cardiologist', prcId: 'PRC 0091223' },
  { name: 'Nurse Karl Vergara', title: 'RN', prcId: 'PRC 0144812' },
  { name: 'Dr. Mateo Santos', title: 'Pediatrician', prcId: 'PRC 0078902' },
];

const recentEvents = [
  { emphasis: 'Emergency scan', detail: 'scan/MP-2026-00428 · 12:09' },
  { emphasis: 'Expert verified', detail: 'Dr. R. Cruz · 11:42' },
  { emphasis: 'Failed login', detail: 'admin@lunas.app · 10:01' },
  { emphasis: 'DB backup ok', detail: '03:00' },
];

export default function OverviewPage() {
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

            <ul className="divide-y divide-neutral-100">
              {pendingVerifications.map((item) => (
                <li key={item.prcId} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-sans text-[1.05rem] font-bold text-[#0D152B]">
                      {item.name}
                    </p>
                    <p className="font-sans text-sm text-[#94a3b8]">
                      {item.title} · {item.prcId}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-full border border-neutral-200 bg-white px-5 py-1.5 text-sm font-medium text-[#0D152B] transition hover:bg-neutral-50"
                  >
                    Review
                  </button>
                </li>
              ))}
            </ul>
          </article>

          {/* 2. Recent System Events (Right Column) */}
          <article className="rounded-2xl border border-neutral-200 bg-white p-8 lg:col-span-2">
            <div className="mb-8 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#10b981]" />
              <h2 className="font-sans text-xl font-bold text-[#0D152B]">
                Recent system events
              </h2>
            </div>

            <ul className="space-y-6">
              {recentEvents.map((event) => (
                <li key={event.emphasis} className="flex flex-col space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-sm font-bold text-[#0D152B]">
                      {event.emphasis}
                    </span>
                    <span className="font-sans text-[0.8rem] text-[#94a3b8]">
                      · {event.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}