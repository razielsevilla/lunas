"use client";

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge, type StatusVariant } from '@/components/ui/StatusBadge';
import { Table } from '@/components/ui/Table';
import { Spinner } from '@/components/ui/Spinner';

type DashboardData = {
  scansToday: number;
  patientsThisWeek: number;
  pendingNotes: number;
  prcStatus: string;
  recentPatients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    accessedAt: string;
  }>;
};

export default function ProfessionalDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/professional/dashboard');
        if (!response.ok) {
          throw new Error('Failed to load dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Professional Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Scans Today"
          value={data.scansToday.toString()}
        />
        <MetricCard
          label="Patients This Week"
          value={data.patientsThisWeek.toString()}
        />
        <MetricCard
          label="Pending Notes"
          value={data.pendingNotes.toString()}
        />
      </div>

      {/* PRC Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">License Status</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">PRC Status:</span>
          <StatusBadge status={(data.prcStatus || 'Pending') as StatusVariant} />
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h2>
        {data.recentPatients.length === 0 ? (
          <p className="text-gray-500">No recent patient accesses.</p>
        ) : (
          <Table<any>
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'accessedAt', label: 'Accessed At' },
            ]}
            data={data.recentPatients.map(patient => ({
              name: `${patient.firstName} ${patient.lastName}`,
              accessedAt: new Date(patient.accessedAt).toLocaleString(),
            }))}
          />
        )}
      </div>
    </div>
  );
}