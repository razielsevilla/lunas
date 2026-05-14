"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Server, 
  Globe, 
  UserCheck,
  MapPin
} from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-ivory font-sans text-night selection:bg-golden/20">
      {/* Decorative Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #0B1120 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* HEADER */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo variant="light" />
        </Link>
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-night"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-12">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-golden mb-6">
            <ShieldCheck size={12} />
            Security & Trust
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tighter text-night md:text-6xl lg:text-7xl">
            Privacy isn&apos;t a feature. <br />
            <span className="text-golden italic">It&apos;s our foundation.</span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl">
            At Lunas, we believe your medical data belongs to you alone. We use military-grade encryption and audited access controls to ensure your information is only available when it matters most.
          </p>
        </div>

        {/* SECURITY PILLARS (Bento Grid) */}
        <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2 mb-32">
          {/* 1. AES-256 Encryption (Wide) */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-golden/10 bg-white/40 p-10 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-8 md:row-span-1">
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-golden/[0.05] text-golden">
                  <Lock size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-night">AES-256 Encryption</h3>
              </div>
              <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
                Military-grade protection. Your records are encrypted using the same standard trusted by global financial institutions and governments.
              </p>

              {/* Bit visualization mockup */}
              <div className="mt-8 flex gap-2">
                {[1, 0, 1, 1, 0, 1, 0, 0, 1, 1].map((bit, i) => (
                  <div key={i} className={`h-8 w-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${bit ? "bg-golden/20 text-golden scale-110" : "bg-night/5 text-night/20"}`}>
                    {bit}
                  </div>
                ))}
                <div className="ml-2 flex items-center text-[10px] font-bold uppercase tracking-widest text-golden/40">...256-bit Key</div>
              </div>
            </div>
          </div>

          {/* 2. Verified Professional Access (Tall) */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-golden/10 bg-white/40 p-10 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-2">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-golden/[0.05] text-golden">
                  <UserCheck size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-night">Verified Access</h3>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Only PRC-licensed and verified medical professionals can decrypt Lunas passports.
              </p>

              {/* ID Card Mockup */}
              <div className="mt-auto pt-12">
                <div className="rounded-2xl border border-golden/20 bg-ivory/50 p-6 relative overflow-hidden group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-golden/10 border border-golden/20 flex items-center justify-center">
                       <UserCheck size={20} className="text-golden" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-night">Dr. Aris Ramos</div>
                      <div className="text-[8px] text-golden font-bold uppercase tracking-widest">Verified Medical Pro</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-night/5" />
                    <div className="h-1.5 w-2/3 rounded-full bg-night/5" />
                  </div>
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Zero-Knowledge Architecture (Square) */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-golden/10 bg-white/40 p-10 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-1">
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-golden/[0.05] text-golden">
                  <Eye size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-night">Zero-Knowledge</h3>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
                Even we can&apos;t see your data. You hold the ultimate keys.
              </p>

              <div className="mt-8 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-golden shadow-glow-sm" />
                <div className="h-px flex-1 bg-gradient-to-r from-golden/50 to-transparent" />
                <div className="text-[10px] font-mono text-golden/40 tracking-widest">ENCRYPTED</div>
              </div>
            </div>
          </div>

          {/* 4. Resilient Infrastructure (Square) */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-golden/10 bg-white/40 p-10 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-1">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-golden/[0.05] text-golden">
                  <Server size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-night">Global Resiliency</h3>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
                Geographically distributed servers with multi-region redundancy.
              </p>

              <div className="mt-auto flex items-center gap-1.5 pt-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400/40 shadow-glow-sm" />
                ))}
                <span className="ml-2 text-[8px] font-bold uppercase tracking-widest text-emerald-500/60">Systems Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLIANCE SECTION */}
        <div className="bg-night rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Globe size={200} strokeWidth={0.5} />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold mb-6">Global Standards</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-golden font-bold text-lg mb-2">HIPAA</div>
                <p className="text-moonlight/40 text-sm">Full compliance with the Health Insurance Portability and Accountability Act standards.</p>
              </div>
              <div>
                <div className="text-golden font-bold text-lg mb-2">GDPR</div>
                <p className="text-moonlight/40 text-sm">Strict adherence to General Data Protection Regulation for user privacy rights.</p>
              </div>
              <div>
                <div className="text-golden font-bold text-lg mb-2">DPA 2012</div>
                <p className="text-moonlight/40 text-sm">Aligned with the Philippines Data Privacy Act of 2012 for secure data processing.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative bg-ivory text-muted-foreground overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-golden/20 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-5">
              <Logo variant="light" />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/70">
                A secure medical passport that gives first responders the right
                information at the right moment — through a single QR code.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                Philippines
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/#features" className="hover:text-golden">Features</Link></li>
                  <li><Link href="/#why" className="hover:text-golden">Why Lunas</Link></li>
                  <li><Link href="/#how" className="hover:text-golden">How it works</Link></li>
                  <li><Link href="/#trust" className="hover:text-golden">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/docs" className="hover:text-golden">Documentation</Link></li>
                  <li><Link href="/help-center" className="hover:text-golden">Help Center</Link></li>
                  <li><Link href="/security" className="hover:text-golden text-golden font-medium">Security & Trust</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/privacy" className="hover:text-golden">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-golden">Terms of Service</Link></li>
                  <li><Link href="/data-processing" className="hover:text-golden">Data Processing</Link></li>
                  <li><Link href="/cookies" className="hover:text-golden">Cookie Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">Connect</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/contact" className="hover:text-golden">Contact Us</Link></li>
                  <li><Link href="/partnerships" className="hover:text-golden">Partnerships</Link></li>
                  <li><Link href="/careers" className="hover:text-golden">Careers</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
            <div className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Lunas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
