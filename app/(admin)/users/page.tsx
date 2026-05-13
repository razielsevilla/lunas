"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import type { TableColumn } from '@/components/ui/Table';
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { StatusVariant } from "@/components/ui/StatusBadge";
import { Table } from "@/components/ui/Table";

// ---------------------------------------------------------------------------
// Types matching GET /api/admin/users response
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
// Map API role + profile data into a display status
// ---------------------------------------------------------------------------
function deriveStatus(user: ApiUser): StatusVariant {
  if (user.role === 'PROFESSIONAL' && user.professionalProfile) {
    const prcMap: Record<string, StatusVariant> = {
      PENDING: 'Pending',
      VERIFIED: 'Verified',
      SUSPENDED: 'Suspended',
      REJECTED: 'Denied',
    };
    return prcMap[user.professionalProfile.prcStatus] ?? 'Active';
  }
  return 'Active';
}

function deriveRole(user: ApiUser): string {
  if (user.role === 'PATIENT') return 'Patient';
  if (user.role === 'PROFESSIONAL') return 'Expert';
  return 'Admin';
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const columns: TableColumn<UserRow>[] = [
  {
    key: 'name',
    label: 'NAME',
    sortable: true,
    headerClassName: 'bg-[#F3ECE4] text-[12px] font-bold tracking-wider text-[#8b8780] uppercase',
    render: (row) => (
      <span className="font-sans font-bold text-[#0D152B]">
        {row.name}
      </span>
    ),
  },
  {
    key: 'email',
    label: 'EMAIL',
    sortable: true,
    headerClassName: 'bg-[#F3ECE4] text-[12px] font-bold tracking-wider text-[#8b8780] uppercase',
    render: (row) => (
      <span className="font-sans text-[#64748b]">
        {row.email}
      </span>
    ),
  },
  {
    key: 'role',
    label: 'ROLE',
    sortable: true,
    headerClassName: 'bg-[#F3ECE4] text-[12px] font-bold tracking-wider text-[#8b8780] uppercase',
    render: (row) => (
      <span className="font-sans text-[#64748b]">
        {row.role}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'STATUS',
    headerClassName: 'bg-[#F3ECE4] text-[12px] font-bold tracking-wider text-[#8b8780] uppercase',
    render: (row) => (
      <StatusBadge 
        status={row.status} 
        className="px-3 py-1 text-sm font-medium" 
      />
    ),
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
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: deriveRole(u),
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
    <div className="space-y-8 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            Users
          </h1>
          <p className="mt-1 font-sans text-lg text-[#64748b]">
            All accounts on the platform.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="h-5 w-5 animate-spin text-[#64748b]" />
            <span className="font-sans text-sm text-[#64748b]">Loading users…</span>
          </div>
        )}

        {/* The Data Table */}
        {!loading && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <Table
              columns={columns}
              data={rows}
              rowClassName="border-b border-neutral-100 last:border-0 hover:bg-transparent"
              initialSortKey="name"
            />
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}