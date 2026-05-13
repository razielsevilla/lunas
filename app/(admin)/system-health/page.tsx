const services = [
  { name: 'API', metric: '99.99%', status: 'Operational' },
  { name: 'Database', metric: '12 ms p95', status: 'Operational' },
  { name: 'QR Service', metric: '1,322 / 24h', status: 'Operational' },
  { name: 'Email Gateway', metric: '0 failures', status: 'Operational' },
  { name: 'Backup Pipeline', metric: 'Last 03:00', status: 'Operational' },
  { name: 'Audit Stream', metric: 'Real-time', status: 'Operational' },
];

export default function SystemHealthPage() {
  return (
    <div className="space-y-8 px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page Header */}
        <header className="text-left">
          <h1 className="font-serif text-[2.75rem] font-bold tracking-tight text-[#0D152B]">
            System health
          </h1>
          <p className="mt-3 font-sans text-lg text-[#64748b]">
            Live infrastructure and service status.
          </p>
        </header>

        {/* Service Health Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="rounded-[22px] border border-neutral-200 bg-white px-5 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-[1.50rem] font-bold leading-none text-[#0D152B]">
                  {service.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce9de] px-3 py-1 text-xs font-medium leading-none text-[#0D152B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6aa487]" />
                  Operational
                </span>
              </div>

              <p className="mt-3 font-sans text-[13px] text-[#2d3f5f]">
                {service.metric}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}