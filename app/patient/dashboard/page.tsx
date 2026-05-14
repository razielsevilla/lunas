"use client";

import { useEffect, useState } from 'react';

import { PatientLayout } from '@/components/layout/PatientLayout';
import { CheckCircle2, Download, Printer, ArrowRight } from 'lucide-react';

type AuthMeResponse = {
	firstName: string;
	lastName: string;
	role: string;
};

function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('') || 'MS';
}

export default function DashboardPage() {
	const [displayName, setDisplayName] = useState('Maria Santos');
	const [roleLabel, setRoleLabel] = useState('Patient');
	const [avatarInitials, setAvatarInitials] = useState('MS');

	useEffect(() => {
		let cancelled = false;

		const loadSessionUser = async () => {
			try {
				const response = await fetch('/api/auth/me', { cache: 'no-store' });

				if (!response.ok) {
					return;
				}

				const data = (await response.json()) as AuthMeResponse;
				const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || 'Maria Santos';

				if (cancelled) {
					return;
				}

				setDisplayName(fullName);
				setAvatarInitials(getInitials(fullName));
				setRoleLabel(data.role === 'PATIENT' ? 'Patient' : data.role);
			} catch {
				// Keep the default mock identity if the auth call fails.
			}
		};

		void loadSessionUser();

		return () => {
			cancelled = true;
		};
	}, []);

	// Mock data to match the visual reference
	const profileCompletion = 92;
	const lastUpdate = { date: 'May 09, 2026', time: '14:22', relative: '2 days ago' };
	const qrStatus = 'Active';

	const recentAccess = [
		{
			id: 1,
			name: 'Dr. Ramon Cruz · MD',
			location: "St. Luke's Medical Center",
			timestamp: 'May 03 · 09:14',
		},
		{
			id: 2,
			name: 'Dr. Liza Garcia · EM',
			location: 'Makati Med Emergency',
			timestamp: 'Apr 21 · 22:08',
		},
		{
			id: 3,
			name: 'Nurse J. Aquino',
			location: 'Barangay Health Center',
			timestamp: 'Mar 15 · 11:42',
		},
	];

	return (
		<PatientLayout
			activePath="/patient/dashboard"
			displayName={displayName}
			roleLabel={roleLabel}
			avatarInitials={avatarInitials}
		>
			<div className="space-y-10">
				<div className="flex items-center gap-3 rounded-2xl border border-[#d1e7dd] bg-[#f2f9f6] px-6 py-4 text-[#0f5132] shadow-sm">
					<CheckCircle2 className="h-5 w-5 text-[#198754]" />
					<span className="text-sm font-medium">Your medical passport is active and ready.</span>
				</div>

				<div>
					<h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">Good evening, {displayName.split(' ')[0]}.</h1>
					<p className="mt-2 text-[#5c6066]">Here's the state of your medical passport.</p>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Profile Completion</p>
						<p className="mt-3 text-3xl font-bold text-[#1a1c1e]">{profileCompletion}%</p>
						<div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
							<div className="h-full bg-[#1a1c1e] transition-all" style={{ width: `${profileCompletion}%` }} />
						</div>
						<button className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#1a1c1e] hover:underline">
							Edit profile <ArrowRight className="h-3 w-3" />
						</button>
					</div>

					<div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Last Profile Update</p>
						<p className="mt-3 text-2xl font-bold text-[#1a1c1e]">{lastUpdate.date}</p>
						<p className="mt-1 text-[11px] text-[#8d8374]">
							{lastUpdate.relative} · {lastUpdate.time}
						</p>
					</div>

					<div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">QR Code Status</p>
						<p className="mt-3 text-3xl font-bold text-[#1a1c1e]">{qrStatus}</p>
						<span className="mt-3 inline-block rounded-full bg-[#d1e7dd] px-3 py-1 text-[10px] font-bold text-[#0f5132]">
							Permanent
						</span>
					</div>

					<div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-sm">
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Recent Access</p>
						<p className="mt-3 text-2xl font-bold text-[#1a1c1e]">Dr. R. Cruz</p>
						<p className="mt-1 text-[11px] text-[#8d8374]">May 03 · 09:14 · St. Luke's</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-10 shadow-sm">
						<h3 className="text-2xl font-bold text-[#1a1c1e]">Your QR passport</h3>
						<p className="mt-2 text-sm text-[#5c6066]">Permanent and non-expiring. Keep it accessible at all times.</p>

						<div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
							<div className="h-44 w-44 rounded-3xl bg-[#fbf8f2] p-4 ring-1 ring-neutral-100">
								<div
									className="h-full w-full bg-[#1a1c1e]"
									style={{
										maskImage: 'url("https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg")',
										maskSize: 'contain',
										WebkitMaskImage: 'url("https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg")',
										WebkitMaskSize: 'contain',
									}}
								/>
							</div>

							<div className="flex flex-col gap-3">
								<button className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-[#1a1c1e] transition-colors hover:bg-neutral-50">
									<Download className="h-4 w-4" /> Download
								</button>
								<button className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-[#1a1c1e] transition-colors hover:bg-neutral-50">
									<Printer className="h-4 w-4" /> Print
								</button>
							</div>
						</div>
					</div>

					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-10 shadow-sm">
						<h3 className="text-2xl font-bold text-[#1a1c1e]">Recent access</h3>

						<div className="mt-8 space-y-8">
							{recentAccess.map((item) => (
								<div key={item.id} className="flex items-center justify-between border-b border-neutral-50 pb-6 last:border-0 last:pb-0">
									<div>
										<p className="text-sm font-bold text-[#1a1c1e]">{item.name}</p>
										<p className="text-xs text-[#8d8374]">{item.location}</p>
									</div>
									<div className="text-right">
										<p className="text-[11px] font-medium uppercase tracking-tighter text-[#8d8374]">{item.timestamp}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</PatientLayout>
	);
}
