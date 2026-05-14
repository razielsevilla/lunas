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

/**
 * Formats an audit event into human-readable text with event type and key metadata.
 * Hides technical IDs and shows only relevant context.
 */
function formatAuditEvent(eventType: string, metadata: Record<string, unknown> | null): string {
  const eventDescriptions: Record<string, string> = {
    PROFESSIONAL_APPROVED: 'Professional Approved',
    PROFESSIONAL_REJECTED: 'Professional Rejected',
    PRC_REVALIDATION: 'PRC License Revalidated',
    FAILED_PIN_LOCKOUT: 'Failed PIN Lockout',
    QR_ACCESS_SUCCESS: 'QR Access Granted',
    QR_ACCESS_DENIED: 'QR Access Denied',
    PIN_CHANGED: 'PIN Changed',
    USER_SUSPENDED: 'User Suspended',
    ADMIN_LOGIN: 'Admin Login',
  };

  const baseDescription = eventDescriptions[eventType] || eventType;

  if (!metadata) return baseDescription;

  // Format relevant metadata based on event type
  const parts: string[] = [];

  if (metadata.prcNumber) {
    parts.push(`PRC: ${metadata.prcNumber}`);
  }

  if (metadata.reason) {
    parts.push(`Reason: ${metadata.reason}`);
  }

  if (metadata.status) {
    parts.push(`Status: ${metadata.status}`);
  }

  if (metadata.ipHash && eventType.includes('LOGIN')) {
    parts.push(`IP: ${String(metadata.ipHash).substring(0, 8)}...`);
  }

  return parts.length > 0 ? `${baseDescription} (${parts.join(', ')})` : baseDescription;
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
    <div className="min-h-screen bg-[#FAF7F2] px-10 py-10">
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
              {logs.map((log) => {
                const readableEvent = formatAuditEvent(log.eventType, log.metadata);
                return (
                  <div
                    key={log.id}
                    className="flex w-full items-center justify-between rounded-full border border-neutral-100 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-1 items-center gap-6">
                      <span className="w-[160px] flex-shrink-0 font-mono text-[12px] text-[#64748b]">
                        {formatTimestamp(log.createdAt)}
                      </span>
                      <span className="flex-1 font-sans text-sm font-medium text-[#0C0E14]">
                        {readableEvent}
                      </span>
                    </div>
                    <span className="flex-shrink-0 text-right font-mono text-[11px] text-[#8E919A]">
                      {log.actorId.substring(0, 8)}...
                      {log.targetId && <span className="ml-3">{log.targetId.substring(0, 8)}...</span>}
                    </span>
                  </div>
                );
              })}
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