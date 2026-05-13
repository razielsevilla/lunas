"use client";

import type { TableColumn } from '@/components/ui/Table';
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table } from "@/components/ui/Table";

type UserRow = {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Verified' | 'Pending';
};

const users: UserRow[] = [
  { name: 'Maria Santos', email: 'maria@example.com', role: 'Patient', status: 'Active' },
  { name: 'Dr. Ramon Cruz', email: 'dr.cruz@stlukes.ph', role: 'Expert', status: 'Verified' },
  { name: 'Juan dela Cruz', email: 'juan@example.com', role: 'Patient', status: 'Active' },
  { name: 'Dr. Andrea Lim', email: 'a.lim@medcity.ph', role: 'Expert', status: 'Pending' },
];

const columns: TableColumn<UserRow>[] = [
  {
    key: 'name',
    label: 'NAME',
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

export default function UsersPage() {
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

        {/* The Data Table */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <Table
            columns={columns}
            data={users}
            rowClassName="border-b border-neutral-100 last:border-0 hover:bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}