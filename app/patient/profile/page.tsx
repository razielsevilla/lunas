"use client";

import { PatientLayout } from '@/components/layout/PatientLayout';
import { Trash2, Plus, AlertTriangle, ChevronUp, Save } from 'lucide-react';

export default function ProfilePage() {
	return (
		<PatientLayout activePath="/patient/profile">
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="flex items-end justify-between">
					<div>
						<h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">My Medical Profile</h1>
						<p className="mt-2 text-sm text-[#8d8374]">Last updated May 09, 2026 · 14:22</p>
					</div>
					<button className="flex items-center gap-2 rounded-2xl bg-[#1a1c1e] px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
						<Save className="h-4 w-4" /> Save Changes
					</button>
				</div>

				<div className="space-y-6">
					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="flex items-center justify-between border-b border-neutral-100 pb-6">
							<h2 className="text-xl font-bold text-[#1a1c1e]">Basic Medical Information</h2>
							<ChevronUp className="h-5 w-5 text-[#8d8374]" />
						</div>

						<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="space-y-2">
								<label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Blood Type</label>
								<select className="w-full rounded-2xl border border-neutral-200 bg-[#fbf8f2] px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1a1c1e]/5">
									<option>O-</option>
									<option>A+</option>
									<option>B+</option>
								</select>
							</div>

							<div className="space-y-2">
								<label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Organ Donor</label>
								<div className="flex items-center gap-6 py-4">
									{['Yes', 'No', 'Not specified'].map((option) => (
										<label key={option} className="flex items-center gap-2 text-sm font-medium text-[#1a1c1e]">
											<input type="radio" name="donor" className="h-4 w-4 border-neutral-300 text-[#1a1c1e] focus:ring-[#1a1c1e]" defaultChecked={option === 'Yes'} />
											{option}
										</label>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Height (cm)</label>
								<input type="number" defaultValue="162" className="w-full rounded-2xl border border-neutral-200 bg-[#fbf8f2] px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
							</div>

							<div className="space-y-2">
								<label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Weight (kg)</label>
								<input type="number" defaultValue="54" className="w-full rounded-2xl border border-neutral-200 bg-[#fbf8f2] px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
							</div>
						</div>
					</div>

					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="flex items-center justify-between border-b border-neutral-100 pb-6">
							<h2 className="text-xl font-bold text-[#1a1c1e]">Allergies</h2>
							<ChevronUp className="h-5 w-5 text-[#8d8374]" />
						</div>

						<div className="mt-8 space-y-4">
							{[
								{ name: 'Penicillin', reaction: 'Anaphylaxis', severity: 'Life-threatening' },
								{ name: 'Shellfish', reaction: 'Swelling', severity: 'Severe' },
							].map((allergy, index) => (
								<div key={index} className="flex flex-wrap items-end gap-4 rounded-[1.5rem] border border-neutral-100 bg-[#fbf8f2]/50 p-5">
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Allergen</label>
										<input type="text" defaultValue={allergy.name} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
									</div>
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Reaction</label>
										<input type="text" defaultValue={allergy.reaction} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
									</div>
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Severity</label>
										<select defaultValue={allergy.severity} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none">
											<option>Life-threatening</option>
											<option>Severe</option>
											<option>Moderate</option>
										</select>
									</div>
									<button className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-500">
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							))}
							<button className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm font-bold text-[#8d8374] hover:border-neutral-400">
								<Plus className="h-4 w-4" /> Add Another Allergy
							</button>
						</div>
					</div>

					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="flex items-center justify-between border-b border-neutral-100 pb-6">
							<h2 className="text-xl font-bold text-[#1a1c1e]">Current Medications</h2>
							<ChevronUp className="h-5 w-5 text-[#8d8374]" />
						</div>

						<div className="mt-8 space-y-6">
							{[
								{ name: 'Salbutamol', dose: '100mcg', freq: 'As needed' },
								{ name: 'Losartan', dose: '50mg', freq: 'Once daily' },
							].map((medication, index) => (
								<div key={index} className="flex flex-wrap items-end gap-4 rounded-[1.5rem] border border-neutral-100 bg-[#fbf8f2]/50 p-5">
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Medication</label>
										<input type="text" defaultValue={medication.name} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
									</div>
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Dosage</label>
										<input type="text" defaultValue={medication.dose} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
									</div>
									<div className="min-w-[200px] flex-1 space-y-2">
										<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Frequency</label>
										<input type="text" defaultValue={medication.freq} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
									</div>
									<button className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-500">
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							))}

							<button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm font-bold text-[#8d8374]">
								<Plus className="h-4 w-4" /> Add Another Medication
							</button>

							<div className="flex items-start gap-3 rounded-2xl border border-[#ffecb5] bg-[#fffcf0] p-6 text-[#664d03]">
								<AlertTriangle className="h-5 w-5 shrink-0 text-[#856404]" />
								<div>
									<p className="text-sm font-bold">Possible interaction detected</p>
									<p className="mt-1 text-xs opacity-80">Losartan and Salbutamol may interact. Confirm with your prescribing physician before continuing.</p>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="flex items-center justify-between border-b border-neutral-100 pb-6">
							<h2 className="text-xl font-bold text-[#1a1c1e]">Emergency Contacts</h2>
							<ChevronUp className="h-5 w-5 text-[#8d8374]" />
						</div>

						<div className="mt-8 space-y-4">
							<div className="flex flex-wrap items-end gap-4 rounded-[1.5rem] border border-neutral-100 bg-[#fbf8f2]/50 p-5">
								<div className="min-w-[200px] flex-1 space-y-2">
									<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Name</label>
									<input type="text" defaultValue="Andres Santos" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
								</div>
								<div className="min-w-[200px] flex-1 space-y-2">
									<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Relationship</label>
									<input type="text" defaultValue="Spouse" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
								</div>
								<div className="min-w-[200px] flex-1 space-y-2">
									<label className="text-[9px] font-bold uppercase tracking-widest text-[#8d8374]">Phone</label>
									<input type="text" defaultValue="+63 917 555 0142" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none" />
								</div>
								<button className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400">
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
							<button className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm font-bold text-[#8d8374]">
								<Plus className="h-4 w-4" /> Add Another Contact
							</button>
						</div>
					</div>

					<div className="rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="flex items-center justify-between border-b border-neutral-100 pb-6">
							<h2 className="text-xl font-bold text-[#1a1c1e]">Additional Notes</h2>
							<ChevronUp className="h-5 w-5 text-[#8d8374]" />
						</div>
						<div className="mt-8">
							<textarea
								placeholder="Anything else first responders should know..."
								className="min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-[#fbf8f2]/50 p-6 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5"
							/>
						</div>
					</div>
				</div>
			</div>
		</PatientLayout>
	);
}
