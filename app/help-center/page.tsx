"use client";

/**
 * Help Center — Lunas
 * A clean, accessible hub for all user inquiries.
 */

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  ArrowLeft,
  Search,
  LifeBuoy,
  ShieldQuestion,
  MessageCircle,
  Smartphone,
  MapPin,
  Plus,
  Mail,
  Zap,
  ShieldCheck,
  Activity,
  History,
  Command,
  Wallet,
  QrCode,
  FileText,
  ArrowRight
} from "lucide-react";

const faqs = [
  {
    category: "EMERGENCY ACCESS",
    question: "Who can actually scan my Lunas QR code?",
    answer: "Only PRC-verified medical professionals and first responders with our secure portal can decrypt and view your full medical history. Every scan is logged and generates an instant alert to your emergency contacts."
  },
  {
    category: "DATA PRIVACY",
    question: "Is my medical information encrypted?",
    answer: "Yes. We use AES-256 military-grade encryption. Your data is encrypted at rest and in transit, and only accessible via a secure, audited decryption gate. We never sell your data to third parties."
  },
  {
    category: "FUNCTIONALITY",
    question: "Do I need an internet connection for the scan to work?",
    answer: "Your primary QR code carries your UUID which requires a connection to fetch live records. However, we also provide a 'Lite' version of your profile for offline access in low-signal areas."
  },
  {
    category: "ACCOUNT",
    question: "How do I update my medical records after I've printed my card?",
    answer: "Simply log into your Lunas dashboard and update your info. Your printed QR code stays the same — it always points to your most current profile in real-time."
  },
];

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-48 pt-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tighter text-night md:text-6xl lg:text-7xl text-balance">
            How can we <br />
            <span className="text-golden italic">help?</span>
          </h1>
          <div className="mt-10 mx-auto max-w-2xl relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              className="w-full rounded-full border border-golden/10 bg-white/60 px-14 py-5 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5 shadow-soft-xl backdrop-blur-sm"
            />
          </div>
        </div>

        {/* BENTO GRID (Explicitly matching image) */}
        <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
          {/* 1. Complete Medical Context (Wide) */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-golden/10 bg-white/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-8 md:row-span-1">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/[0.05] text-golden">
                  <Activity size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-night">Complete Medical Context</h3>
              </div>
              <p className="mt-3 max-w-md text-sm text-muted-foreground/70">
                Beyond basic IDs. Lunas carries your full clinical context — allergies, medications, and surgical history.
              </p>

              {/* Mini Dashboard UI Mockup */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-night/[0.02] border border-border/50 p-5 transition-colors group-hover:bg-night/[0.04]">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-night/30">Blood Type</div>
                  <div className="mt-2 text-xl font-bold text-golden">O- Negative</div>
                </div>
                <div className="rounded-2xl bg-night/[0.02] border border-border/50 p-5 transition-colors group-hover:bg-night/[0.04]">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-night/30">Allergies</div>
                  <div className="mt-2 text-xl font-bold text-[#D4736E]">Penicillin +2</div>
                </div>
                <div className="rounded-2xl bg-night/[0.02] border border-border/50 p-5 transition-colors group-hover:bg-night/[0.04]">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-night/30">Conditions</div>
                  <div className="mt-2 text-xl font-bold text-night">Asthma</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Real-time Awareness (Tall) */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-golden/10 bg-white/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-2">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/[0.05] text-golden">
                  <History size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-night">Real-time Awareness</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
                Optimized for speed at any scale.
              </p>

              <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter text-night">2.1s</span>
                  <span className="text-[10px] font-bold text-night/30 uppercase tracking-[0.2em]">Avg Scan</span>
                </div>
                <div className="mt-8 h-2.5 w-full overflow-hidden rounded-full bg-night/5">
                  <div className="h-full w-[85%] rounded-full bg-golden shadow-glow-sm transition-all duration-1000 group-hover:w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Data Sovereignty (Square) */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-golden/10 bg-white/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-1">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/[0.05] text-golden">
                  <ShieldCheck size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-night">Data Sovereignty</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
                Your data is yours. Military-grade encryption.
              </p>

              <div className="mt-8 flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-night/[0.04] border border-border/50 transition-transform group-hover:scale-110">
                  <Command size={20} className="text-night/30" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-night/[0.04] border border-border/50 text-xl font-bold text-night/30 transition-transform group-hover:scale-110">
                  K
                </div>
              </div>
            </div>
          </div>

          {/* 4. Multi-Format Access (Square) */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-golden/10 bg-white/40 p-8 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-2xl md:col-span-4 md:row-span-1">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/[0.05] text-golden">
                  <Smartphone size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-night">Multi-Format Access</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
                Wallet, Print, and Cloud integrations.
              </p>

              <div className="mt-8 flex gap-3 overflow-hidden">
                {[Wallet, QrCode, FileText, Smartphone].map((Icon, idx) => (
                  <div key={idx} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-night/[0.04] border border-border/50 transition-colors hover:bg-night/10">
                    <Icon size={20} className="text-night/30" />
                  </div>
                ))}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-night/[0.04] border border-border/50 transition-colors">
                  <Plus size={18} className="text-night/20" />
                </div>
              </div>

              <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-golden/60 transition-colors group-hover:text-golden">
                <span>View all formats</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Updated FAQ Section to match FAQTestimonials.tsx aesthetic */}
        <div className="mt-24 space-y-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-balance">
              Answers to your most <br />
              <span className="text-golden italic">common questions</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-balance">
              Everything you need to know to get started and get support quickly.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] items-start">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  onClick={() => toggleFAQ(index)}
                  className={`group cursor-pointer rounded-3xl border border-border p-8 transition-all duration-300 ${openIndex === index ? "bg-white border-golden/30 shadow-soft" : "bg-white/40 hover:border-golden/50"
                    }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors group-hover:text-golden">
                    {faq.category}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <h3 className={`text-xl font-medium tracking-tight transition-colors ${openIndex === index ? "text-night" : "text-night/80 group-hover:text-night"
                      }`}>
                      {faq.question}
                    </h3>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-night/50 transition-all duration-500 ${openIndex === index ? "rotate-45 border-golden bg-golden/5 text-golden" : "group-hover:border-golden/40 group-hover:text-golden"
                      }`}>
                      <Plus size={18} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className={`grid transition-all duration-500 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
                    }`}>
                    <div className="overflow-hidden">
                      <p className="text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="group relative rounded-[2.5rem] bg-night p-8 md:p-12 text-moonlight overflow-hidden h-full flex flex-col justify-between border border-white/5 transition-all duration-700 hover:border-golden/20 shadow-2xl">
              {/* Decorative high-tech elements */}
              <div className="absolute top-0 right-0 p-8 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="h-32 w-32 rounded-full border border-golden/30 animate-pulse" />
              </div>

              <div className="relative z-10 space-y-8">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <div className="h-2 w-2 rounded-full bg-golden animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-golden">System Operational</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-4xl font-bold text-white leading-tight">
                    Premium <br />
                    <span className="text-golden italic">Concierge Support</span>
                  </h3>
                  <p className="text-moonlight/50 text-lg leading-relaxed max-w-sm">
                    Access our priority assistance network. We're committed to your safety 24/7.
                  </p>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link href="/contact" className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 transition-all hover:bg-white/10 hover:border-golden/30">
                    <MessageCircle className="h-6 w-6 text-golden" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Message</span>
                  </Link>
                  <a href="mailto:support@lunas.health" className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 p-6 border border-white/5 transition-all hover:bg-white/10 hover:border-golden/30">
                    <Mail className="h-6 w-6 text-golden" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
                  </a>
                </div>
              </div>

              <div className="relative z-10 mt-12">
                <Link
                  href="/contact"
                  className="group/btn flex w-full items-center justify-between rounded-full bg-golden p-1 px-6 h-16 text-night transition-all hover:shadow-[0_0_40px_-10px_rgba(255,191,0,0.5)] hover:scale-[1.02] active:scale-95"
                >
                  <span className="font-bold tracking-tight pl-2">Start Priority Ticket</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-night text-golden transition-transform group-hover/btn:translate-x-1">
                    <ArrowLeft className="h-5 w-5 rotate-180" strokeWidth={2.5} />
                  </div>
                </Link>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-moonlight/30">Average response: 12 minutes</p>
              </div>

              {/* Advanced Gradient background */}
              <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-golden/10 blur-[120px]" />
              <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-amber-glow/5 blur-[100px]" />
            </div>
          </div>
        </div>
      </main>

      <footer className="relative bg-ivory text-muted-foreground overflow-hidden">
        {/* Decorative glow orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-golden/[0.04] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-60 w-60 rounded-full bg-amber-glow/[0.04] blur-[80px]" />

        {/* Thin golden divider */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-golden/20 to-transparent" />
        </div>

        {/* ── Main footer grid ── */}
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
            {/* Brand column */}
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

            {/* Nav columns */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Product */}
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">
                  Product
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="/#features" className="transition-colors hover:text-golden">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="/#why" className="transition-colors hover:text-golden">
                      Why Lunas
                    </a>
                  </li>
                  <li>
                    <a href="/#how" className="transition-colors hover:text-golden">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="/#trust" className="transition-colors hover:text-golden">
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/docs" className="transition-colors hover:text-golden">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/help-center" className="transition-colors hover:text-golden text-golden font-medium">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="transition-colors hover:text-golden">
                      Security & Trust
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">
                  Legal
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/privacy" className="transition-colors hover:text-golden">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="transition-colors hover:text-golden">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/data-processing" className="transition-colors hover:text-golden">
                      Data Processing
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="transition-colors hover:text-golden">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-night">
                  Connect
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/contact" className="transition-colors hover:text-golden">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/partnerships" className="transition-colors hover:text-golden">
                      Partnerships
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="transition-colors hover:text-golden">Careers</Link>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
            <div className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Lunas
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
              <Link href="/privacy" className="transition-colors hover:text-golden">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-golden">
                Terms
              </Link>
              <Link href="/data-processing" className="transition-colors hover:text-golden">
                Data Processing
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-golden">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
