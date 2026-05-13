"use client";

const verifications = [
  { name: 'Dr. Andrea Lim', title: 'Cardiologist', prcId: '#0091223' },
  { name: 'Nurse Karl Vergara', title: 'Registered Nurse', prcId: '#0144812' },
  { name: 'Dr. Mateo Santos', title: 'Pediatrician', prcId: '#0078902' },
];

export default function VerificationsPage() {
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

        {/* Verification Request Cards Stack */}
        <div className="space-y-3">
          {verifications.map((item) => (
            <article
              key={item.prcId}
              className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-8 py-6 transition-shadow hover:shadow-sm"
            >
              {/* Professional Info */}
              <div className="space-y-1">
                <h2 className="font-sans text-[1.25rem] font-bold text-[#0D152B]">
                  {item.name}
                </h2>
                <p className="font-sans text-sm text-[#94a3b8]">
                  {item.title} · PRC {item.prcId}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-medium text-[#0D152B] transition-colors hover:bg-neutral-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="rounded-full bg-[#0D152B] px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Approve
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}