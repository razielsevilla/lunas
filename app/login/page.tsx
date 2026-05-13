"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "+63",
    prcNumber: "",
    profession: "",
    specialization: "", 
    hospital: "",       
    password: "",
    confirmPassword: "",
    agreed: false       
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const isStep1Complete = formData.firstName && formData.lastName && formData.email && formData.mobile.length > 3;
  const isStep2Complete = formData.prcNumber && formData.profession && formData.profession !== "";
  const isStep3Complete = formData.password.length >= 8 && formData.password === formData.confirmPassword && formData.agreed;

  const getStrength = () => {
    const pwd = formData.password;
    if (pwd.length === 0) return { label: "", color: "bg-slate-100", text: "text-slate-400", count: 0 };
    if (pwd.length < 6) return { label: "Too short", color: "bg-red-500", text: "text-red-500", count: 1 };
    if (pwd.length < 10) return { label: "Fair", color: "bg-orange-400", text: "text-orange-400", count: 2 };
    return { label: "Strong", color: "bg-green-500", text: "text-green-500", count: 3 };
  };

  const strength = getStrength();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <nav className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-orange-400 rounded-full"></div>
            <span className="text-xl font-serif font-bold text-slate-900">Lunas</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{formData.firstName} {formData.lastName}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">{formData.profession}</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
          </div>
        </nav>
        <main className="p-8 md:p-12 max-w-6xl mx-auto w-full">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome to your dashboard</h1>
            <p className="text-slate-500 mb-8">Verification is currently in progress for PRC License #{formData.prcNumber}.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-slate-50">
                <span className="text-2xl mb-4 block">📋</span>
                <p className="text-slate-500 text-sm font-medium">Patient Records</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
              </div>
              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-slate-50">
                <span className="text-2xl mb-4 block">⚖️</span>
                <p className="text-slate-500 text-sm font-medium">Pending Audits</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
              </div>
              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-slate-50">
                <span className="text-2xl mb-4 block">🛡️</span>
                <p className="text-slate-500 text-sm font-medium">Verification Status</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">Pending</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* 1. Left Branding Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden flex-col items-center justify-center text-white px-20">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-5xl font-serif font-bold mb-4 tracking-tight">Care, verified.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Your PRC license unlocks responsible, audited access to patient records.</p>
        </div>
      </div>

      {/* 2. Right Workspace */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-20 relative">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-400 rounded-full opacity-80"></div>
            <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Lunas</span>
          </div>
          <button onClick={() => step > 1 && setStep(step - 1)} className="flex items-center text-slate-500 font-medium hover:text-slate-900 transition-colors">
            <span className="mr-2">←</span> Back
          </button>
        </div>

        <div className="mb-10 text-slate-900">
          <h1 className="text-[32px] font-serif font-bold mb-2">Medical expert registration</h1>
          <p className="text-slate-500 font-medium mb-6">Step {step} of 3</p>
          <div className="flex space-x-2 h-1.5 w-full max-w-md">
            <div className="flex-1 bg-[#0F172A] rounded-full transition-all"></div>
            <div className={`flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#0F172A]' : 'bg-slate-100'}`}></div>
            <div className={`flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#0F172A]' : 'bg-slate-100'}`}></div>
          </div>
        </div>

        <form className="space-y-6 max-w-md" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-slate-200 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-slate-200 text-slate-900" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Email Address</label>
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="dr.name@hospital.ph" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Mobile Number</label>
                <input name="mobile" value={formData.mobile} onChange={handleInputChange} type="text" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900" />
                <p className="text-[11px] text-slate-400">Philippine format, e.g. +63 917 555 0142</p>
              </div>
              <button 
                onClick={() => setStep(2)} 
                disabled={!isStep1Complete}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 mt-8 transition-all duration-300 ${isStep1Complete ? 'bg-[#334155] text-white shadow-lg' : 'bg-[#8E97A4] text-slate-200 cursor-not-allowed opacity-70'}`}
              >
                <span>Continue</span> <span>→</span>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">PRC License Number</label>
                <input name="prcNumber" value={formData.prcNumber} onChange={handleInputChange} type="text" placeholder="0123456" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900" />
                <p className="text-[11px] text-slate-400">Required — verified with the Professional Regulation Commission.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Profession</label>
                <select name="profession" value={formData.profession} onChange={handleInputChange} className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 appearance-none text-slate-900">
                  <option value="">Select...</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Emergency Medicine Specialist">Emergency Medicine Specialist</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Paramedic">Paramedic</option>
                  <option value="EMT">EMT</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Specialization (Optional)</label>
                <input name="specialization" value={formData.specialization} onChange={handleInputChange} type="text" placeholder="e.g. Cardiology" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Affiliated Hospital (Optional)</label>
                <input name="hospital" value={formData.hospital} onChange={handleInputChange} type="text" placeholder="e.g. St. Luke's" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900" />
              </div>
              <div className="flex space-x-4 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-200 text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-50">← Previous</button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!isStep2Complete}
                  className={`flex-[2] font-bold py-4 rounded-2xl transition-all duration-300 ${isStep2Complete ? 'bg-[#334155] text-white shadow-lg' : 'bg-[#8E97A4] text-slate-200 cursor-not-allowed opacity-70'}`}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl pl-12 pr-12 py-3.5 text-slate-900" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-1 h-1 flex-1 mr-4">
                    <div className={`flex-1 rounded-full transition-colors ${strength.count >= 1 ? strength.color : 'bg-slate-100'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strength.count >= 2 ? strength.color : 'bg-slate-100'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strength.count >= 3 ? strength.color : 'bg-slate-100'}`}></div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase transition-colors ${strength.text}`}>{strength.label}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-[#FDFBF7] border border-slate-100 rounded-2xl pl-12 pr-12 py-3.5 text-slate-900" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirmPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-4">
                <input name="agreed" type="checkbox" checked={formData.agreed} onChange={handleInputChange} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F172A]" />
                <p className="text-sm text-slate-500 leading-snug">I confirm my credentials are accurate and agree to the Lunas professional code of conduct.</p>
              </div>

              <div className="flex space-x-4 mt-8">
                <button onClick={() => setStep(2)} className="flex-1 bg-white border border-slate-200 text-slate-900 font-bold py-4 rounded-2xl">← Previous</button>
                <button 
                  onClick={() => setIsSubmitted(true)}
                  disabled={!isStep3Complete}
                  className={`flex-[2] font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 ${isStep3Complete ? 'bg-[#334155] text-white shadow-lg' : 'bg-[#8E97A4] text-slate-200 cursor-not-allowed opacity-70'}`}
                >
                  <span>Submit for verification</span> 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}