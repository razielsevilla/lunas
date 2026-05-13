"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import type { TableColumn } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { StatusVariant } from '@/components/ui/StatusBadge';
import { Table } from '@/components/ui/Table';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ApiUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'PROFESSIONAL' | 'ADMIN';
  mobile: string | null;
  createdAt: string;
  professionalProfile: {
    prcNumber: string;
    profession: string;
    prcStatus: string;
  } | null;
  patientProfile: {
    profileComplete: boolean;
    qrUuid: string | null;
  } | null;
};

type UserRow = {
  name: string;
  email: string;
  role: string;
  status: StatusVariant;
};

// ---------------------------------------------------------------------------
// Derivations
// ---------------------------------------------------------------------------

function deriveStatus(user: ApiUser): StatusVariant {
  if (user.role === 'PROFESSIONAL' && user.professionalProfile) {
    const map: Record<string, StatusVariant> = {
      PENDING:   'Pending',
      VERIFIED:  'Verified',
      SUSPENDED: 'Suspended',
      REJECTED:  'Denied',
    };
    return map[user.professionalProfile.prcStatus] ?? 'Active';
  }
  return 'Active';
}

function deriveRole(user: ApiUser): string {
  if (user.role === 'PATIENT') return 'Patient';
  if (user.role === 'PROFESSIONAL') return 'Expert';
  return 'Admin';
}

// ---------------------------------------------------------------------------
// Status badge styles — sage green for Active/Verified, soft tan for Pending
// ---------------------------------------------------------------------------

function InlineStatusBadge({ status }: { status: StatusVariant }) {
  const styles: Record<string, string> = {
    Active:    'bg-[#D6E8D8] text-[#2E5E36]',
    Verified:  'bg-[#D6E8D8] text-[#2E5E36]',
    Pending:   'bg-[#EEE3CF] text-[#7A5C30]',
    Suspended: 'bg-[#F3DDD8] text-[#8B3A2E]',
    Denied:    'bg-[#F3DDD8] text-[#8B3A2E]',
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold ${
        styles[status] ?? 'bg-neutral-100 text-neutral-600'
      }`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const columns: TableColumn<UserRow>[] = [
  {
    key: 'name',
    label: 'NAME',
    sortable: true,
    headerClassName: 'bg-[#EDE6DB] px-6 py-3 text-[11px] font-bold tracking-widest text-[#8B7D6B] uppercase',
    render: (row) => (
      <span className="font-sans font-bold text-[#0D152B]">{row.name}</span>
    ),
  },
  {
    key: 'email',
    label: 'EMAIL',
    sortable: true,
    headerClassName: 'bg-[#EDE6DB] px-6 py-3 text-[11px] font-bold tracking-widest text-[#8B7D6B] uppercase',
    render: (row) => (
      <span className="font-sans text-[#64748b]">{row.email}</span>
    ),
  },
  {
    key: 'role',
    label: 'ROLE',
    sortable: true,
    headerClassName: 'bg-[#EDE6DB] px-6 py-3 text-[11px] font-bold tracking-widest text-[#8B7D6B] uppercase',
    render: (row) => (
      <span className="font-sans text-[#64748b]">{row.role}</span>
    ),
  },
  {
    key: 'status',
    label: 'STATUS',
    headerClassName: 'bg-[#EDE6DB] px-6 py-3 text-[11px] font-bold tracking-widest text-[#8B7D6B] uppercase',
    render: (row) => <InlineStatusBadge status={row.status} />,
  },
];

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

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const json = await res.json();
      const mapped: UserRow[] = (json.users as ApiUser[]).map((u) => ({
        name:   `${u.firstName} ${u.lastName}`,
        email:  u.email,
        role:   deriveRole(u),
        status: deriveStatus(u),
      }));
      setRows(mapped);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-[#F2EDE6] px-10 py-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* Page Header */}
        <header className="mb-8">
          {/* Bold serif title as specified */}
          <h1 className="font-serif text-[2.6rem] font-bold tracking-tight text-[#0D152B]">
            Users
          </h1>
          <p className="mt-2 font-sans text-base text-[#6B7FA3]">
            All accounts on the platform.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <Loader2 className="h-5 w-5 animate-spin text-[#6B7FA3]" />
            <span className="font-sans text-sm text-[#6B7FA3]">Loading users…</span>
          </div>
        )}

        {/* Data Table — white rounded container */}
        {!loading && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <Table
              columns={columns}
              data={rows}
              rowClassName="border-b border-neutral-100 px-6 py-4 last:border-0 hover:bg-[#FAFAF8] transition-colors"
              initialSortKey="name"
            />
          </div>
        )}
      </div>

      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}