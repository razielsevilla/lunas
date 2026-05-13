"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

// ---------------------------------------------------------------------------
// Types matching GET /api/admin/audit-logs response
// ---------------------------------------------------------------------------

type AuditLogEntry = {
  id: string;
  eventType: string;
  actorId: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function formatMetadata(meta: Record<string, unknown> | null): string {
  if (!meta) return '';
  return Object.entries(meta)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
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

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (p: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/audit-logs?page=${p}&limit=25`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json = await res.json();
      setLogs(json.logs);
      setPagination(json.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(page); }, [fetchLogs, page]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-12 py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="mb-12 text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0C0E14]">
            Audit logs
          </h1>
          <p className="mt-2 font-sans text-lg text-[#8E919A]">
            Every privileged action, signed and timestamped.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[24px]">
            <LunasLoader />
          </div>
        )}

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-[#1A1D26]/10 bg-white px-8 py-16 text-center shadow-sm">
            <p className="font-sans text-sm text-[#8E919A]">No audit logs recorded yet.</p>
          </div>
        )}

        {/* Log Entry Feed */}
        {!loading && logs.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex w-full items-center rounded-full border border-neutral-100 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Monospace Records & Visual Muting */}
                  <p className="truncate font-mono text-[14px] text-[#64748b]">
                    <span className="mr-6 inline-block w-[160px]">{formatTimestamp(log.createdAt)}</span>
                    <span className="mr-6 inline-block w-[150px] font-medium text-[#0C0E14]">{log.eventType}</span>
                    <span className="tracking-tight">
                      actor={log.actorId}
                      {log.targetId && ` target=${log.targetId}`}
                      {log.metadata && ` ${formatMetadata(log.metadata)}`}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-[#0C0E14] transition-colors hover:bg-neutral-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-sans text-sm text-[#8E919A]">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-[#0C0E14] transition-colors hover:bg-neutral-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}