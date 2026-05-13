"use client";

import React from 'react';

export default function ScanPatientPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 2. Instructional Header */}
      <div className="space-y-3">
        <h1 className="text-6xl font-serif font-bold text-slate-900 tracking-tight">
          Scan patient QR
        </h1>
        <p className="text-xl font-sans text-slate-500 font-medium">
          Position the QR within the frame. You'll be asked for your professional PIN.
        </p>
      </div>

      {/* 3. Central Scanning Interface (The Viewfinder) */}
      <div className="relative">
        <div className="w-full aspect-video md:aspect-[16/9] bg-white border-4 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-slate-200/60">
          
          {/* Scanning Indicator Overlay */}
          <div className="flex flex-col items-center space-y-8 relative z-10">
            <div className="relative w-56 h-56 flex items-center justify-center">
              
              {/* Corner Brackets (Dark Navy #0F172A) */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#0F172A] rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#0F172A] rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#0F172A] rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#0F172A] rounded-br-2xl"></div>
              
              {/* Animated Scanning Line */}
              <div className="w-4/5 h-[2px] bg-orange-400 absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_15px_rgba(251,146,60,0.8)]"></div>

              {/* Viewfinder Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-serif font-bold text-slate-900">
                Camera preview (demo)
              </p>
              <p className="text-slate-400 font-sans font-medium tracking-wide uppercase text-xs">
                Waiting for secure connection...
              </p>
            </div>
          </div>

          {/* Background pattern for "empty" state */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="flex items-center justify-center space-x-3 text-slate-400 opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <p className="text-xs font-sans font-bold uppercase tracking-[0.2em]">
          End-to-end encrypted medical access
        </p>
      </div>
    </div>
  );
}
