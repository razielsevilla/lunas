"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

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
  switch (status.toLowerCase()) {
    case 'operational':
      return {
        bg: 'bg-[#dce9de]',
        dot: 'bg-[#4f7962]',
        text: 'text-[#0C0E14]',
        label: 'Operational',
      };
    case 'degraded':
      return {
        bg: 'bg-[#f5ebd7]',
        dot: 'bg-[#d4a64a]',
        text: 'text-[#0C0E14]',
        label: 'Degraded',
      };
    case 'down':
      return {
        bg: 'bg-[#f3e2df]',
        dot: 'bg-[#c2544b]',
        text: 'text-[#0C0E14]',
        label: 'Down',
      };
    default:
      return {
        bg: 'bg-[#f0ebdf]',
        dot: 'bg-[#8d8374]',
        text: 'text-[#0C0E14]',
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
    <div className="fixed bottom-6 right-6 z-50 rounded-[16px] border border-red-200 bg-white px-6 py-4 shadow-lg">
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
    <div className="min-h-screen bg-[#FAF7F2] px-12 py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="mb-12 text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0C0E14]">
            System health
          </h1>
          <p className="mt-2 font-sans text-lg text-[#8E919A]">
            Live infrastructure and service status.
          </p>
          {data && (
            <p className="mt-2 font-sans text-sm text-[#8E919A]">
              Last checked: {new Date(data.checkedAt).toLocaleTimeString()}
              {' · '}
              Overall:{' '}
              <span className={data.overallStatus === 'healthy' ? 'font-medium text-[#4f7962]' : 'font-medium text-[#d4a64a]'}>
                {data.overallStatus === 'healthy' ? 'All Systems Healthy' : 'Degraded'}
              </span>
            </p>
          )}
        </header>

        {/* Loading State */}
        {loading && !data && (
          <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[24px]">
            <LunasLoader />
          </div>
        )}

        {/* Service Health Grid */}
        {data && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => {
              const styles = getStatusStyles(service.status);

              return (
                <article
                  key={service.name}
                  className="relative flex min-h-[140px] flex-col justify-center rounded-[24px] border border-neutral-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Status Indicator (Top Right) */}
                  <div className="absolute right-6 top-6">
                    <span className={`inline-flex items-center gap-2 rounded-full ${styles.bg} px-3.5 py-1.5 text-xs font-medium leading-none ${styles.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                      {styles.label}
                    </span>
                  </div>

                  {/* Service Info */}
                  <div className="space-y-1.5 pr-24">
                    <h2 className="font-serif text-[1.5rem] font-bold leading-tight text-[#0C0E14]">
                      {service.name}
                    </h2>
                    
                    {/* Technical Details */}
                    <div className="font-sans text-[15px] text-[#8E919A]">
                      <span>{service.description}</span>
                      {service.latencyMs !== null && (
                        <span className="ml-1 text-[#C5A377]">
                          · {service.latencyMs}ms p95
                        </span>
                      )}
                    </div>
                  </div>
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