"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2, X } from 'lucide-react';
import LunasLoader from '@/components/ui/loader';

// ---------------------------------------------------------------------------
// Types — ZERO PHI POLICY
// Only practitioner metadata is modelled. No patient data fields are
// declared or consumed. Any unexpected keys in the API payload are
// stripped by `sanitizeProfessionals()` before they reach component state.
// ---------------------------------------------------------------------------

/** Allowed user fields — name only; no contact_info, no diagnosis. */
type PractitionerUserMeta = {
  id: string;
  firstName: string;
  lastName: string;
};

type ProfessionalVerification = {
  id: string;
  prcNumber: string;
  profession: string;
  prcStatus: string;
  createdAt: string;
  user: PractitionerUserMeta;
};

// ---------------------------------------------------------------------------
// PHI fields that must NEVER leak into client state
// ---------------------------------------------------------------------------

const PHI_BLOCKLIST: ReadonlySet<string> = new Set([
  'patient_name',
  'patientName',
  'diagnosis',
  'contact_info',
  'contactInfo',
  'address',
  'phone',
  'ssn',
  'dob',
  'dateOfBirth',
  'medicalRecord',
  'insurance',
]);

// ---------------------------------------------------------------------------
// Response Sanitisation
// ---------------------------------------------------------------------------

/**
 * Strips any unexpected / PHI-adjacent keys from every professional record
 * that the API returns.  Only the fields declared in
 * `ProfessionalVerification` survive.
 */
// AUDIT: Response verified for zero Patient PHI.
// This sanitiser runs on every fetch before the payload reaches React state.
// Any key present in PHI_BLOCKLIST or absent from the safe-list is dropped.
function sanitizeProfessionals(
  raw: Record<string, unknown>[],
): ProfessionalVerification[] {
  const SAFE_TOP_KEYS: ReadonlySet<string> = new Set([
    'id',
    'prcNumber',
    'profession',
    'prcStatus',
    'createdAt',
    'user',
  ]);

  const SAFE_USER_KEYS: ReadonlySet<string> = new Set([
    'id',
    'firstName',
    'lastName',
  ]);

  return raw.map((entry) => {
    // ── Top-level audit ────────────────────────────────────────────────
    for (const key of Object.keys(entry)) {
      if (PHI_BLOCKLIST.has(key)) {
        // Silently drop — never log the value
        delete entry[key];
      }
      if (!SAFE_TOP_KEYS.has(key)) {
        delete entry[key];
      }
    }

    // ── Nested `user` audit ────────────────────────────────────────────
    const user = entry.user as Record<string, unknown> | undefined;
    if (user && typeof user === 'object') {
      for (const key of Object.keys(user)) {
        if (PHI_BLOCKLIST.has(key) || !SAFE_USER_KEYS.has(key)) {
          delete user[key];
        }
      }
    }

    return entry as unknown as ProfessionalVerification;
  });
}

// ---------------------------------------------------------------------------
// Toast — Centralised feedback
// ---------------------------------------------------------------------------

type ToastVariant = 'success' | 'error';

function Toast({
  message,
  variant = 'success',
  onClose,
}: {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = variant === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[16px] border px-6 py-4 shadow-lg backdrop-blur-sm transition-all ${
        isSuccess
          ? 'border-[#C5A377]/30 bg-white text-[#0C0E14]'
          : 'border-red-200 bg-white text-red-600'
      }`}
    >
      {/* Golden accent bar for success */}
      {isSuccess && (
        <span className="h-5 w-[3px] shrink-0 rounded-full bg-[#C5A377]" />
      )}
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
      <div className="w-full max-w-md rounded-[24px] border border-neutral-100 bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#0C0E14]">
            Reject verification
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#8E919A] transition-colors hover:text-[#0C0E14]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 font-sans text-sm text-[#8E919A]">
          Provide a reason for rejecting{' '}
          <span className="font-bold text-[#0C0E14]">{professionalName}</span>.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. PRC license number could not be verified…"
          rows={4}
          className="mt-4 w-full rounded-[16px] border border-neutral-200 bg-[#FAF7F2] px-4 py-3 font-sans text-sm text-[#0C0E14] placeholder-[#8E919A] outline-none transition-all focus:border-[#0C0E14] focus:ring-1 focus:ring-[#0C0E14]"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2 font-sans text-sm font-medium text-[#0C0E14] transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim() || isSubmitting}
            onClick={() => onConfirm(reason.trim())}
            className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 font-sans text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ProfessionalVerification | null>(null);

  // ── Fetch + sanitise ───────────────────────────────────────────────
  // AUDIT: Response verified for zero Patient PHI.
  // No console.log(data) — all raw payloads are sanitised before use.
  const fetchVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/verifications');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json = await res.json();

      // ── PHI Sanitisation Gate ──────────────────────────────────────
      const sanitised = sanitizeProfessionals(
        Array.isArray(json.professionals) ? json.professionals : [],
      );
      setProfessionals(sanitised);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Failed to load verifications.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // ── Approve Handler ────────────────────────────────────────────────
  const handleApprove = async (prof: ProfessionalVerification): Promise<void> => {
    try {
      setActionInProgress(prof.id);
      const res = await fetch(`/api/admin/verifications/${prof.id}/approve`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Approve failed (${res.status})`);
      }

      // Optimistic removal — no full refetch needed
      setProfessionals((prev) => prev.filter((p) => p.id !== prof.id));
      setToast({ message: 'Verification approved.', variant: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Approve failed.',
        variant: 'error',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Reject Handler ─────────────────────────────────────────────────
  const handleReject = async (reason: string): Promise<void> => {
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

      // Optimistic removal + close modal
      setProfessionals((prev) => prev.filter((p) => p.id !== rejectTarget.id));
      setRejectTarget(null);
      setToast({ message: 'Rejection recorded.', variant: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Reject failed.',
        variant: 'error',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF7F2] px-12 py-12">
      <div className="mx-auto w-full max-w-6xl">

        {/* Page Header */}
        <header className="mb-12 text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0C0E14]">
            Expert verifications
          </h1>
          <p className="mt-2 font-sans text-lg text-[#8E919A]">
            Review PRC license submissions.
          </p>
        </header>

        {/* ── Loading State ─────────────────────────────────────────── */}
        {loading && (
          <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[24px]">
            <LunasLoader />
          </div>
        )}

        {/* ── Empty State ───────────────────────────────────────────── */}
        {!loading && professionals.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-[#1A1D26]/10 bg-white px-8 py-16 text-center shadow-sm">
            <p className="font-sans text-sm text-[#8E919A]">
              No pending verifications.
            </p>
          </div>
        )}

        {/* ── Verification Cards ────────────────────────────────────── */}
        {!loading && professionals.length > 0 && (
          <div className="flex flex-col gap-3">
            {professionals.map((prof) => {
              const fullName = `${prof.user.firstName} ${prof.user.lastName}`;
              const isBusy = actionInProgress === prof.id;

              return (
                <article
                  key={prof.id}
                  className={`group relative flex items-center justify-between gap-6 rounded-[24px] border bg-white px-8 py-6 shadow-sm transition-all hover:shadow-md ${
                    isBusy
                      ? 'border-[#C5A377]/40 shadow-[0_0_0_1px_rgba(197,163,119,0.15)]'
                      : 'border-neutral-100'
                  }`}
                >
                  {/* Golden glow indicator for active/busy state */}
                  {isBusy && (
                    <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-[#C5A377]" />
                  )}

                  {/* Credentials — only PRC #, Profession, Name */}
                  <div className="min-w-0 space-y-1">
                    <h2 className="font-sans text-[1.1rem] font-bold text-[#0C0E14]">
                      {fullName}
                    </h2>
                    <p className="font-sans text-sm text-[#8E919A]">
                      {prof.profession} · PRC {prof.prcNumber} ·{' '}
                      {new Date(prof.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Dual action buttons — Reject (border) + Approve (solid navy) */}
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setRejectTarget(prof)}
                      className="rounded-full border border-neutral-200 bg-white px-6 py-2 font-sans text-sm font-medium text-[#0C0E14] transition-colors hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleApprove(prof)}
                      className="flex items-center gap-2 rounded-full bg-[#0C0E14] px-6 py-2 font-sans text-sm font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
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

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          professionalName={`${rejectTarget.user.firstName} ${rejectTarget.user.lastName}`}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
          isSubmitting={actionInProgress === rejectTarget.id}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}