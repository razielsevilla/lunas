"use client";

import { useEffect, useMemo, useState } from 'react';

import { PatientLayout } from '@/components/layout/PatientLayout';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type TableColumn } from '@/components/ui/Table';

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
          <div>
            <p className="font-semibold text-[#1a1c1e]">{row.professional.name}</p>
            <p className="text-xs text-[#8d8374]">
              {row.professional.profession} · PRC {row.professional.prcNumber}
            </p>
          </div>
        ),
      },
      {
        key: 'accessedAt',
        label: 'Timestamp',
        render: (row) => <span>{formatDateTime(row.accessedAt)}</span>,
      },
      {
        key: 'durationSeconds',
        label: 'Duration',
        render: (row) => <span>{row.durationSeconds ? `${row.durationSeconds}s` : 'N/A'}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => <Badge variant={badgeVariantForStatus(row.status)}>{row.status}</Badge>,
      },
    ],
    [],
  );

  return (
    <PatientLayout activePath="/patient/access-logs">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">Access Logs</h1>
          <p className="mt-2 text-sm text-[#8d8374]">A history of who opened your medical passport.</p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[18rem] items-center justify-center rounded-[2rem] border border-neutral-200 bg-white">
            <Spinner size="lg" label="Loading access logs" />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : (
          <Table
            columns={columns}
            data={logs}
            emptyState="No access logs yet."
            initialSortKey="accessedAt"
            initialSortDirection="desc"
          />
        )}
      </div>
    </PatientLayout>
  );
}
