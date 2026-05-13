const auditLogs = [
  {
    timestamp: "2026-05-11 12:09:14",
    action: "EMERGENCY_SCAN",
    attributes: "actor=expert:RC target=patient:MP-2026-00428",
  },
  {
    timestamp: "2026-05-11 11:42:03",
    action: "EXPERT_VERIFIED",
    attributes: "actor=admin:SA target=expert:RC",
  },
  {
    timestamp: "2026-05-11 10:01:55",
    action: "LOGIN_FAILED",
    attributes: "actor=admin@lunas.app ip=203.177.x.x",
  },
  {
    timestamp: "2026-05-11 03:00:00",
    action: "DB_BACKUP_OK",
    attributes: "size=4.2GB",
  },
];

export default function AuditLogsPage() {
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

        {/* Log Entry Feed */}
        <div className="mt-8 flex flex-col gap-3">
          {auditLogs.map((log, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-white/70 px-5 py-2.5"
            >
              <p className="font-mono text-[18px] leading-tight tracking-tight text-[#355070]">
                <span className="mr-3">{log.timestamp}</span>
                <span className="mr-2">{log.action}</span>
                <span>{log.attributes}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}