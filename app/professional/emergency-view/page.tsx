"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Clock } from 'lucide-react';

type PatientData = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  bloodType: string;
  organDonor: boolean;
  allergies: Array<{
    allergen: string;
    reaction: string;
    severity: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  drugInteractions: Array<{
    drug1: string;
    drug2: string;
    severity: string;
    description: string;
  }>;
  surgeries: Array<{
    procedure: string;
    datePerformed: string;
    hospital: string;
    notes: string;
  }>;
};

export default function EmergencyView() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [accessTime] = useState(new Date());

  useEffect(() => {
    // Read patient data from sessionStorage (set by PIN entry page)
    const data = sessionStorage.getItem('emergencyPatientData');
    if (data) {
      try {
        setPatientData(JSON.parse(data));
      } catch (error) {
        console.error('Failed to parse patient data:', error);
        router.push('/professional/dashboard');
      }
    } else {
      // No data, redirect back
      router.push('/professional/dashboard');
    }
  }, [router]);

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-blue-400 mb-4" />
          <p className="text-white font-medium">Loading patient data...</p>
        </div>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatAccessTime = (date: Date) => {
    return date.toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    router.push('/professional/dashboard');
  };

  const age = patientData ? calculateAge(patientData.birthDate) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white print:bg-white print:text-black">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl print:hidden">
        <div className="mx-auto max-w-6xl px-6 py-4 sm:px-10 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{formatAccessTime(accessTime)}</span>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-600/20 ring-1 ring-blue-500/20 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-slate-950/40 backdrop-blur-xl ring-1 ring-white/10 print:border-black print:bg-white print:shadow-none print:ring-0">
          <div className="rounded-t-[2rem] border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 print:border-b-black print:bg-white print:text-black">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-red-300 ring-1 ring-red-500/20 print:bg-red-100 print:text-red-900 print:ring-red-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400 print:bg-red-600 animate-pulse" /> EMERGENCY ACCESS
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl print:text-black">
                  {patientData.firstName} {patientData.lastName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base print:text-gray-700">
                  Critical medical information for emergency response. All data is encrypted and access is logged.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm print:flex-col">
                <div className="rounded-3xl bg-white/5 px-4 py-3 text-slate-100 print:bg-gray-100 print:text-black">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Age</div>
                  <div className="mt-2 text-2xl font-semibold">{age}</div>
                </div>
                <div className="rounded-3xl bg-white/5 px-4 py-3 text-slate-100 print:bg-gray-100 print:text-black">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Blood Type</div>
                  <div className="mt-2 text-2xl font-semibold">{patientData.bloodType}</div>
                </div>
                <div className="rounded-3xl bg-white/5 px-4 py-3 text-slate-100 print:bg-gray-100 print:text-black">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Organ Donor</div>
                  <div className="mt-2 text-2xl font-semibold">{patientData.organDonor ? '✓ Yes' : '✗ No'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8">
            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <article className="rounded-3xl bg-slate-900/80 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                      <path d="M12 1.75c-5.627 0-10.25 4.623-10.25 10.25 0 5.888 6.512 10.687 10.077 11.567a1.25 1.25 0 0 0 1.146 0c3.565-.88 10.077-5.679 10.077-11.567 0-5.627-4.623-10.25-10.25-10.25Z" />
                      <path d="M12 7.75v6" strokeLinecap="round" />
                      <path d="M9 10.75h6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Patient snapshot</p>
                    <p className="text-lg font-semibold text-white">Critical summary</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Medical alert</p>
                    <p className="mt-2 text-sm text-slate-200">Review life-threatening allergies first. Avoid contraindicated medications.</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                    <p className="mt-2 text-sm text-slate-200">Access logged. Emergency contacts notified. Records are live.</p>
                  </div>
                </div>
              </article>

              <aside className="rounded-3xl bg-slate-900/85 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick facts</p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">Patient ID</span>
                    <span className="text-sm font-semibold text-white">{patientData.id.slice(0, 8)}…</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">Allergy count</span>
                    <span className="text-sm font-semibold text-white">{patientData.allergies.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">Medication count</span>
                    <span className="text-sm font-semibold text-white">{patientData.medications.length}</span>
                  </div>
                </div>
              </aside>
            </section>

            <section className="rounded-3xl bg-slate-900/85 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10 print:bg-white print:shadow-none print:ring-1 print:ring-black">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Allergies</p>
                  <h2 className="text-2xl font-bold text-white print:text-black">⚠️ Critical reactions</h2>
                </div>
                {patientData.allergies.length > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-200 ring-1 ring-red-500/30 w-fit print:bg-red-100 print:text-red-900 print:ring-red-300">
                    <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse print:animate-none" /> {patientData.allergies.length} Allerg{patientData.allergies.length === 1 ? 'y' : 'ies'}
                  </div>
                )}
              </div>
              {patientData.allergies.length === 0 ? (
                <p className="text-slate-400 print:text-gray-600">✓ No known allergies recorded for this patient.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {patientData.allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl border p-5 transition-all ${
                        allergy.severity === 'LIFE_THREATENING'
                          ? 'border-red-500/60 bg-red-500/15 ring-1 ring-red-400/30 print:border-red-600 print:bg-red-100 print:text-black'
                          : allergy.severity === 'SEVERE'
                          ? 'border-orange-400/50 bg-orange-400/15 ring-1 ring-orange-300/30 print:border-orange-600 print:bg-orange-100 print:text-black'
                          : 'border-slate-700 bg-slate-950/70 print:border-gray-400 print:bg-gray-50 print:text-black'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-white print:text-black">{allergy.allergen}</p>
                          <p className="mt-2 text-slate-300 print:text-gray-700">{allergy.reaction}</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] whitespace-nowrap ${
                          allergy.severity === 'LIFE_THREATENING'
                            ? 'bg-red-500/25 text-red-100 print:bg-red-600 print:text-white'
                            : allergy.severity === 'SEVERE'
                            ? 'bg-orange-500/25 text-orange-100 print:bg-orange-600 print:text-white'
                            : 'bg-slate-700 text-slate-200 print:bg-gray-400 print:text-black'
                        }`}
                        >{allergy.severity.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-slate-900/85 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10 print:bg-white print:shadow-none print:ring-1 print:ring-black print:text-black">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Medications</p>
                    <h2 className="text-2xl font-bold text-white print:text-black">💊 Current prescriptions</h2>
                  </div>
                  {patientData.medications.length > 0 && (
                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-bold text-blue-200 ring-1 ring-blue-500/30 print:bg-blue-100 print:text-blue-900 print:ring-blue-300">
                      {patientData.medications.length}
                    </span>
                  )}
                </div>
                {patientData.medications.length === 0 ? (
                  <p className="text-slate-400 print:text-gray-600">No current medications listed.</p>
                ) : (
                  <div className="space-y-4">
                    {patientData.medications.map((med, index) => (
                      <div key={index} className="rounded-3xl bg-white/5 p-4 print:bg-gray-100 print:border-l-4 print:border-blue-600">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-lg font-bold text-white print:text-black">{med.name}</p>
                            <p className="mt-1 text-sm text-slate-300 print:text-gray-700">{med.dosage}</p>
                          </div>
                          <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap print:bg-gray-300 print:text-black">
                            {med.frequency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-slate-900/85 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10 print:bg-white print:shadow-none print:ring-1 print:ring-black print:text-black">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Drug Interactions</p>
                  <h2 className="text-2xl font-bold text-white print:text-black">⚡ Interaction risk</h2>
                </div>
                {patientData.drugInteractions.length === 0 ? (
                  <p className="text-slate-400 print:text-gray-600">✓ No known drug interactions recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {patientData.drugInteractions.map((interaction, index) => (
                      <div key={index} className={`rounded-3xl border p-4 transition-all ${
                        interaction.severity === 'HIGH'
                          ? 'border-red-500/50 bg-red-500/15 ring-1 ring-red-400/30 print:border-red-600 print:bg-red-100 print:text-black'
                          : interaction.severity === 'MODERATE'
                          ? 'border-yellow-500/40 bg-yellow-500/15 ring-1 ring-yellow-400/30 print:border-yellow-600 print:bg-yellow-100 print:text-black'
                          : 'border-slate-700 bg-slate-950/80 print:border-gray-400 print:bg-gray-50 print:text-black'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-bold text-white print:text-black">{interaction.drug1} + {interaction.drug2}</p>
                          <span className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap ${
                            interaction.severity === 'HIGH'
                              ? 'bg-red-500/25 text-red-100 print:bg-red-600 print:text-white'
                              : interaction.severity === 'MODERATE'
                              ? 'bg-yellow-500/25 text-yellow-100 print:bg-yellow-600 print:text-white'
                              : 'bg-slate-700 text-slate-200 print:bg-gray-400 print:text-black'
                          }`}
                          >{interaction.severity}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-300 print:text-gray-700">{interaction.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900/85 p-6 shadow-lg shadow-black/20 ring-1 ring-white/10 print:bg-white print:shadow-none print:ring-1 print:ring-black">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-gray-600">Surgical history</p>
                  <h2 className="text-2xl font-bold text-white print:text-black">🏥 Procedures & records</h2>
                </div>
                {patientData.surgeries.length > 0 && (
                  <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-bold text-purple-200 ring-1 ring-purple-500/30 print:bg-purple-100 print:text-purple-900 print:ring-purple-300">
                    {patientData.surgeries.length}
                  </span>
                )}
              </div>
              {patientData.surgeries.length === 0 ? (
                <p className="text-slate-400 print:text-gray-600">No surgical history available.</p>
              ) : (
                <div className="space-y-4">
                  {patientData.surgeries.map((surgery, index) => (
                    <div key={index} className="rounded-3xl bg-white/5 p-4 print:bg-gray-100 print:border-l-4 print:border-purple-600 print:text-black">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-lg font-bold text-white print:text-black">{surgery.procedure}</p>
                        <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap print:bg-gray-300 print:text-black">
                          {new Date(surgery.datePerformed).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300 print:text-gray-700">{surgery.hospital}</p>
                      {surgery.notes && <p className="mt-3 text-xs text-slate-400 print:text-gray-600 italic">{surgery.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="rounded-[1.75rem] bg-gradient-to-r from-red-900/95 to-red-950/95 px-6 py-6 text-center text-white shadow-lg shadow-red-950/40 ring-1 ring-red-400/20 print:bg-red-100 print:text-red-900 print:ring-red-300 print:shadow-none">
              <p className="text-base font-bold uppercase tracking-[0.28em] text-red-100/95 print:text-red-900">
                🚨 EMERGENCY VIEW — ACCESS LOGGED — CONTACTS NOTIFIED
              </p>
              <p className="mt-3 max-w-2xl mx-auto text-sm text-red-200/90 print:text-red-800">
                All actions have been recorded in the audit trail. Patient emergency contacts were notified immediately for rapid follow-up care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}