"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

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
    <div className="space-y-8 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            Audit logs
          </h1>
          <p className="mt-3 font-sans text-lg text-[#64748b]">
            Every privileged action, signed and timestamped.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="h-5 w-5 animate-spin text-[#64748b]" />
            <span className="font-sans text-sm text-[#64748b]">Loading audit logs…</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
            <p className="font-sans text-sm text-[#94a3b8]">No audit logs recorded yet.</p>
          </div>
        )}

        {/* Log Entry Feed */}
        {!loading && logs.length > 0 && (
          <>
            <div className="mt-8 flex flex-col gap-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-neutral-200 bg-white/70 px-5 py-2.5"
                >
                  <p className="font-mono text-[18px] leading-tight tracking-tight text-[#355070]">
                    <span className="mr-3">{formatTimestamp(log.createdAt)}</span>
                    <span className="mr-2 inline-block rounded bg-[#f0ebdf] px-2 py-0.5 text-[14px] font-bold text-[#7f715b]">
                      {log.eventType}
                    </span>
                    <span className="text-[#8d8374]">
                      actor={log.actorId.slice(0, 8)}
                      {log.targetId && ` target=${log.targetId.slice(0, 8)}`}
                      {log.metadata && ` ${formatMetadata(log.metadata)}`}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-[#0D152B] transition-colors hover:bg-neutral-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-sans text-sm text-[#64748b]">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-[#0D152B] transition-colors hover:bg-neutral-50 disabled:opacity-40"
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