"use client";

import React from 'react';

export default function ProfessionalDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* 1. Top-Level Status & Identity: Verification Banner */}
      <div className="bg-[#E9F2EC] border border-[#D1E2D6] rounded-full px-6 py-4 flex items-center space-x-4 shadow-sm">
        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <p className="text-[#2D4A3A] font-sans font-semibold tracking-tight text-md">
          Verified · <span className="opacity-70">PRC #0078451</span> · <span className="opacity-70">St. Luke's Medical Center</span>
        </p>
      </div>

      {/* 1. Greeting Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-6xl font-serif font-bold text-slate-900 tracking-tight">
            Good evening, Dr. Cruz.
          </h1>
          <p className="text-xl font-sans text-slate-500 font-medium">
            Here is your clinical activity at a glance.
          </p>
        </div>
      </div>

      {/* 2. Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Scans Today" 
          value="7" 
          subline="2 emergency" 
        />
        <MetricCard 
          title="Patients This Week" 
          value="24" 
          subline="+12% vs last" 
          isPositive 
        />
        <MetricCard 
          title="Pending Notes" 
          value="3" 
          subline="Add summaries" 
          isWarning
        />
        <MetricCard 
          title="Verification" 
          value="Active" 
          subline="Renews May 2027" 
        />
      </div>

      {/* 3. Primary Action & Patient Logs (Lower Split Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Scanner Quick-Access (Left - 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between min-h-[400px]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Scan a patient passport</h2>
            <p className="text-slate-500 font-sans leading-relaxed text-lg">
              Open the secure viewfinder to scan a patient's Lunas QR code and request emergency access to their medical records.
            </p>
          </div>
          
          <button className="mt-8 w-full bg-[#0F172A] hover:bg-slate-800 text-white rounded-2xl py-5 px-6 flex items-center justify-center space-x-3 transition-all transform active:scale-[0.98]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="7" x="8.5" y="8.5" rx="1"/></svg>
            <span className="font-sans font-bold text-lg tracking-wide uppercase">Open Scanner</span>
          </button>
        </div>

        {/* Recent Patients Feed (Right - 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Recent patients</h2>
          
          <div className="divide-y divide-slate-50">
            <PatientEntry 
              name="Maria Santos" 
              age="34F" 
              context="Allergy: Penicillin · Type O+" 
              time="10:42" 
            />
            <PatientEntry 
              name="Juan dela Cruz" 
              age="45M" 
              context="Chronic: Hypertension · Type A-" 
              time="09:18" 
            />
            <PatientEntry 
              name="Liza Reyes" 
              age="28F" 
              context="No known allergies · Type B+" 
              time="Yesterday" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Component: Metric Card */
function MetricCard({ title, value, subline, isPositive, isWarning }: any) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg shadow-slate-200/40 hover:translate-y-[-4px] transition-all duration-300">
      <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
        {title}
      </p>
      <p className="text-5xl font-serif font-bold text-slate-900 mb-2">
        {value}
      </p>
      <p className={`text-sm font-sans font-semibold ${
        isPositive ? 'text-emerald-600' : isWarning ? 'text-orange-500' : 'text-slate-500 opacity-60'
      }`}>
        {subline}
      </p>
    </div>
  );
}

/* Helper Component: Patient Entry */
function PatientEntry({ name, age, context, time }: any) {
  return (
    <div className="py-6 flex justify-between items-center group cursor-pointer">
      <div className="space-y-1">
        <p className="text-xl font-sans font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {name} <span className="font-medium text-slate-400 ml-1">· {age}</span>
        </p>
        <p className="text-md font-sans text-slate-500 font-medium">
          {context}
        </p>
      </div>
      <p className="text-sm font-sans font-bold text-slate-300 uppercase tracking-widest">
        {time}
      </p>
    </div>
  );
}