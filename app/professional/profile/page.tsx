"use client";

import React from 'react';

export default function ProfilePage() {
  return (
    <div className="max-w-6xl animate-in fade-in duration-700">
      {/* 2. Header & Instructional Context */}
      <header className="mb-12">
        <h1 className="text-[42px] font-serif font-bold text-slate-900 tracking-tight mb-2">
          My professional profile
        </h1>
        <p className="text-lg text-slate-500 font-sans tracking-wide">
          PRC-verified credentials and contact details.
        </p>
      </header>

      {/* 3. Professional Data Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Identity Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Identity</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-medium">Name</span>
              <span className="text-slate-900 font-bold">Dr. Ramon Cruz</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-medium">Email</span>
              <span className="text-slate-900 font-bold">dr.cruz@stlukes.ph</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Mobile</span>
              <span className="text-slate-900 font-bold">+63 917 555 0142</span>
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Credentials</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-medium">PRC #</span>
              <span className="text-slate-900 font-bold">0078451</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-medium">Profession</span>
              <span className="text-slate-900 font-bold">Emergency Medicine Specialist</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-medium">Specialization</span>
              <span className="text-slate-900 font-bold">Trauma</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Affiliation</span>
              <span className="text-slate-900 font-bold">St. Luke's Medical Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}