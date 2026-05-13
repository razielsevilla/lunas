"use client";

export default function RecentPatientsPage() {
  const patients = [
    {
      id: 1,
      name: 'Maria Santos',
      passportId: 'MP-2026-00428',
      lastAccess: 'Today at 2:30 PM',
      reason: 'Emergency Consultation',
    },
    {
      id: 2,
      name: 'Juan dela Cruz',
      passportId: 'MP-2025-09812',
      lastAccess: 'Yesterday at 10:15 AM',
      reason: 'Follow-up Visit',
    },
    {
      id: 3,
      name: 'Anna Rodriguez',
      passportId: 'MP-2026-00521',
      lastAccess: '2 days ago',
      reason: 'Routine Checkup',
    },
    {
      id: 4,
      name: 'Carlos Mendez',
      passportId: 'MP-2025-08934',
      lastAccess: '1 week ago',
      reason: 'Lab Results Review',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-3">Recent patients</h1>
        <p className="text-xl text-slate-500">Patients you have accessed in the last 30 days.</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#F5F3ED] grid grid-cols-4 gap-6 p-6 border-b border-slate-100">
          <div className="text-sm font-bold uppercase tracking-widest text-slate-700">Patient Name</div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-700">Passport ID</div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-700">Last Access</div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-700">Reason</div>
        </div>

        {/* Table Rows */}
        {patients.map((patient, index) => (
          <div
            key={patient.id}
            className={`grid grid-cols-4 gap-6 p-6 ${
              index !== patients.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <div className="font-bold text-slate-900">{patient.name}</div>
            <div className="text-slate-500">{patient.passportId}</div>
            <div className="text-slate-600">{patient.lastAccess}</div>
            <div className="text-slate-600">{patient.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
