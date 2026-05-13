"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types matching GET /api/admin/verifications response
// ---------------------------------------------------------------------------

type ProfessionalVerification = {
  id: string;
  prcNumber: string;
  profession: string;
  prcStatus: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
};

// ---------------------------------------------------------------------------
// Toast component
// ---------------------------------------------------------------------------
function Toast({ message, variant = 'success', onClose }: { message: string; variant?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = variant === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : 'border-red-200 bg-red-50 text-red-600';

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-6 py-4 shadow-lg ${colors}`}>
      <p className="font-sans text-sm">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reject Modal
// ---------------------------------------------------------------------------
function RejectModal({
  professionalName,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  professionalName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#0D152B]">Reject verification</h3>
          <button type="button" onClick={onCancel} className="text-[#94a3b8] hover:text-[#0D152B] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 font-sans text-sm text-[#64748b]">
          Provide a reason for rejecting <span className="font-bold text-[#0D152B]">{professionalName}</span>.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. PRC license number could not be verified…"
          rows={4}
          className="mt-4 w-full rounded-xl border border-neutral-200 bg-[#FDF9F3] px-4 py-3 font-sans text-sm text-[#0D152B] placeholder-[#94a3b8] outline-none focus:border-[#0D152B] focus:ring-1 focus:ring-[#0D152B] transition-all"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-medium text-[#0D152B] transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim() || isSubmitting}
            onClick={() => onConfirm(reason.trim())}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VerificationsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ProfessionalVerification | null>(null);

  const fetchVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/verifications');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json = await res.json();
      setProfessionals(json.professionals);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to load verifications.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async (prof: ProfessionalVerification) => {
    try {
      setActionInProgress(prof.id);
      const res = await fetch(`/api/admin/verifications/${prof.id}/approve`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Approve failed (${res.status})`);
      }
      setToast({ message: 'Verification Approved', variant: 'success' });
      await fetchVerifications(); // refresh list
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Approve failed.', variant: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────────
  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    try {
      setActionInProgress(rejectTarget.id);
      const res = await fetch(`/api/admin/verifications/${rejectTarget.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Reject failed (${res.status})`);
      }
      setToast({ message: 'Professional rejected and notified.', variant: 'success' });
      setRejectTarget(null);
      await fetchVerifications(); // refresh list
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Reject failed.', variant: 'error' });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-8 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            Expert verifications
          </h1>
          <p className="mt-2 font-sans text-lg text-[#64748b]">
            Review PRC license submissions.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="h-5 w-5 animate-spin text-[#64748b]" />
            <span className="font-sans text-sm text-[#64748b]">Loading verifications…</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && professionals.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
            <p className="font-sans text-sm text-[#94a3b8]">No pending verifications.</p>
          </div>
        )}

        {/* Verification Request Cards Stack */}
        {!loading && professionals.length > 0 && (
          <div className="space-y-3">
            {professionals.map((prof) => {
              const fullName = `${prof.user.firstName} ${prof.user.lastName}`;
              const isBusy = actionInProgress === prof.id;

              return (
                <article
                  key={prof.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-8 py-6 transition-shadow hover:shadow-sm"
                >
                  {/* Professional Info */}
                  <div className="space-y-1">
                    <h2 className="font-sans text-[1.25rem] font-bold text-[#0D152B]">
                      {fullName}
                    </h2>
                    <p className="font-sans text-sm text-[#94a3b8]">
                      {prof.profession} · PRC {prof.prcNumber} · {new Date(prof.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setRejectTarget(prof)}
                      className="rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-medium text-[#0D152B] transition-colors hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleApprove(prof)}
                      className="rounded-full bg-[#0D152B] px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                      Approve
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectTarget && (
        <RejectModal
          professionalName={`${rejectTarget.user.firstName} ${rejectTarget.user.lastName}`}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
          isSubmitting={actionInProgress === rejectTarget.id}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </div>
  );
}