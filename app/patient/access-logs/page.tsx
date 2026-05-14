"use client";

import { useEffect, useMemo, useState } from 'react';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Badge } from '@/components/ui/Badge';
import { Table, type TableColumn } from '@/components/ui/Table';
import LunasLoader from '@/components/ui/loader';

type AccessLog = {
  id: string;
  accessedAt: string;
  status: string;
  durationSeconds: number | null;
  professional: {
    name: string;
    prcNumber: string;
    profession: string;
  };
};

type AccessLogsResponse = {
  logs: AccessLog[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function badgeVariantForStatus(status: string) {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'success';
    case 'DENIED':
    case 'LOCKED':
      return 'destructive';
    default:
      return 'warning';
  }
}

export default function PatientAccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set Browser Tab Title
  useEffect(() => {
    document.title = "Lunas | Patient";
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/patient/access-logs', { cache: 'no-store' });
        const data = (await response.json()) as Partial<AccessLogsResponse> & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load access logs.');
        }

        if (!cancelled) {
          setLogs(data.logs ?? []);
          setError(null);
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError.message || 'Unable to load access logs.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo<Array<TableColumn<AccessLog>>>(
    () => [
      {
        key: 'professional',
        label: 'Professional',
        render: (row) => (
          <div className="py-2">
            <p className="font-bold text-[#2D2822]">{row.professional.name}</p>
            <p className="text-xs font-medium text-[#7B8C70]">
              {row.professional.profession} · PRC {row.professional.prcNumber}
            </p>
          </div>
        ),
      },
      {
        key: 'accessedAt',
        label: 'Timestamp',
        render: (row) => <span className="text-[#2D2822]">{formatDateTime(row.accessedAt)}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => <Badge variant={badgeVariantForStatus(row.status)}>{row.status}</Badge>,
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <PatientLayout activePath="/patient/access-logs">
        <div className="flex h-[60vh] w-full items-center justify-center">
          <LunasLoader />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout activePath="/patient/access-logs">
      {/* FIX: The padding (px-10 py-10) is placed on this static outer div. 
          The animation is placed on the inner div. This prevents the "shifting" 
          effect during the transition.
      */}
      <div className="mx-auto max-w-6xl px-10 py-10">
        <div className="space-y-10 animate-in fade-in duration-500 fill-mode-both">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-[#2D2822]">
              Access Logs
            </h1>
            <p className="mt-2 text-sm font-medium text-[#7B8C70]">
              A history of who opened your medical passport.
            </p>
          </div>

          {error ? (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
              <Table
                columns={columns}
                data={logs}
                emptyState="No access logs yet."
                initialSortKey="accessedAt"
                initialSortDirection="desc"
              />
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}