import React from 'react';
import Link from 'next/link';
import { HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden flex shadow-2xl min-h-[600px]">
        
        {/* Left Section: Branding & Pattern (Referencing Screenshot 2026-05-14 050715.png) */}
        <div className="relative w-1/2 bg-[#001F2D] p-12 flex flex-col items-center justify-center text-center text-white overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}
          />
          
          <div className="relative z-10">
            <div className="bg-white/10 p-4 rounded-2xl inline-block mb-8 backdrop-blur-sm border border-white/10">
              <Stethoscope size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4 tracking-tight">
              Welcome to Lunas
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto">
              A secure medical passport for patients and the professionals who care for them.
            </p>
          </div>
        </div>

        {/* Right Section: Role Selection */}
        <div className="w-1/2 p-12 flex flex-col">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-100 rounded-full transform translate-x-1" />
              </div>
              <span className="text-2xl font-serif font-bold text-[#001F2D]">Lunas</span>
            </div>
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-black transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-5xl font-serif font-bold text-[#001F2D] mb-2">
              Choose your role
            </h2>
            <p className="text-slate-500 mb-10">
              Personalize your Lunas experience.
            </p>

            <div className="space-y-4">
              {/* Patient Option Link */}
              <Link href="/register/patient" className="block">
                <button className="w-full group flex items-center p-6 bg-[#FAF9F6] border border-slate-100 rounded-3xl hover:border-slate-300 hover:shadow-md transition-all text-left">
                  <div className="bg-[#EFEDE8] p-4 rounded-2xl mr-5">
                    <HeartPulse className="text-slate-700" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-[#001F2D]">Patient</h3>
                    <p className="text-sm text-slate-500">Carry your medical record. Share it instantly when it matters.</p>
                  </div>
                  <ArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>

              {/* Medical Expert Option Link */}
              <Link href="/register/professional" className="block">
                <button className="w-full group flex items-center p-6 bg-[#FAF9F6] border border-slate-100 rounded-3xl hover:border-slate-300 hover:shadow-md transition-all text-left">
                  <div className="bg-[#EFEDE8] p-4 rounded-2xl mr-5">
                    <Stethoscope className="text-slate-700" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-[#001F2D]">Medical Expert</h3>
                    <p className="text-sm text-slate-500">Verified access to patient records in clinical and emergency settings.</p>
                  </div>
                  <ArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Administrator text removed as requested */}
        </div>
      </div>
    </div>
  );
}