"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types matching GET /api/admin/system-health response
// ---------------------------------------------------------------------------

type ServiceStatus = {
  name: string;
  status: string;
  latencyMs: number | null;
  description: string;
};

type SystemHealthData = {
  overallStatus: 'healthy' | 'degraded';
  checkedAt: string;
  services: ServiceStatus[];
};

// ---------------------------------------------------------------------------
// Status styling
// ---------------------------------------------------------------------------

function getStatusStyles(status: string) {
  switch (status) {
    case 'operational':
      return {
        bg: 'bg-[#dce9de]',
        dot: 'bg-[#6aa487]',
        text: 'text-[#0D152B]',
        label: 'Operational',
      };
    case 'degraded':
      return {
        bg: 'bg-[#f5ebd7]',
        dot: 'bg-[#d4a64a]',
        text: 'text-[#a57b37]',
        label: 'Degraded',
      };
    case 'down':
      return {
        bg: 'bg-[#f3e2df]',
        dot: 'bg-[#c2544b]',
        text: 'text-[#9b5d56]',
        label: 'Down',
      };
    default:
      return {
        bg: 'bg-[#f0ebdf]',
        dot: 'bg-[#8d8374]',
        text: 'text-[#7f715b]',
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
  }
}

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

export default function SystemHealthPage() {
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/system-health');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json: SystemHealthData = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system health.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => { fetchHealth(); }, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return (
    <div className="space-y-8 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            System health
          </h1>
          <p className="mt-3 font-sans text-lg text-[#64748b]">
            Live infrastructure and service status.
          </p>
          {data && (
            <p className="mt-1 font-sans text-xs text-[#94a3b8]">
              Last checked: {new Date(data.checkedAt).toLocaleString()}
              {' · '}
              Overall:{' '}
              <span className={data.overallStatus === 'healthy' ? 'font-bold text-[#4f6b56]' : 'font-bold text-[#a57b37]'}>
                {data.overallStatus === 'healthy' ? 'All Systems Healthy' : 'Degraded'}
              </span>
            </p>
          )}
        </header>

        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="h-5 w-5 animate-spin text-[#64748b]" />
            <span className="font-sans text-sm text-[#64748b]">Checking services…</span>
          </div>
        )}

        {/* Service Health Grid */}
        {data && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => {
              const styles = getStatusStyles(service.status);

              return (
                <article
                  key={service.name}
                  className="rounded-[22px] border border-neutral-200 bg-white px-5 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-[1.50rem] font-bold leading-none text-[#0D152B]">
                      {service.name}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${styles.bg} px-3 py-1 text-xs font-medium leading-none ${styles.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                      {styles.label}
                    </span>
                  </div>

                  <p className="mt-3 font-sans text-[13px] text-[#2d3f5f]">
                    {service.description}
                  </p>
                  {service.latencyMs !== null && (
                    <p className="mt-1 font-mono text-[12px] text-[#8d8374]">
                      Latency: {service.latencyMs}ms
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}