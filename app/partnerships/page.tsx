"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  ArrowLeft,
  Building2,
  ShieldPlus,
  Network,
  Send,
  CheckCircle2,
  MapPin
} from "lucide-react";

export default function PartnershipsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const partnerPillars = [
    {
      icon: Building2,
      title: "Healthcare Providers",
      description: "Integrate Lunas into your hospital or clinic to streamline patient onboarding and emergency response.",
      detail: "Hospitals & Clinics",
    },
    {
      icon: ShieldPlus,
      title: "Insurance Partners",
      description: "Offer Lunas as a premium value-add to your policyholders, ensuring their safety worldwide.",
      detail: "Health Insurance",
    },
    {
      icon: Network,
      title: "Technology Integrators",
      description: "Connect your health-tech solutions with our secure medical passport API infrastructure.",
      detail: "API & SDK Access",
    },
  ];

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
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">

          {/* Left Column - Context & Info */}
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tighter text-night md:text-6xl lg:text-7xl">
                Let&apos;s build <br />
                <span className="text-golden italic">together.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground/80 text-balance">
                Partner with Lunas to integrate secure medical passports into your
                existing healthcare infrastructure. Together, we can save lives.
              </p>
            </div>

            {/* Quick Pillars */}
            <div className="space-y-6">
              {partnerPillars.map((s, idx) => (
                <div key={idx} className="group relative flex items-start gap-5 rounded-2xl border border-golden/10 bg-white/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-xl">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-golden/[0.05] text-golden/60 transition-colors group-hover:bg-golden/10 group-hover:text-golden">
                    <s.icon size={24} strokeWidth={1.2} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-night">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground/70">
                      {s.description}
                    </p>
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-golden/60">
                      {s.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="relative">
            {/* Subtle glow behind the form */}
            <div className="absolute -inset-4 rounded-[3rem] bg-golden/5 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-night/[0.03] bg-white/60 p-8 shadow-soft-2xl backdrop-blur-md md:p-12 lg:p-16">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 border-b border-night/5 pb-8">
                    <h2 className="font-display text-3xl font-bold text-night">Partner Inquiry</h2>
                    <p className="text-sm text-muted-foreground/60">Tell us about your organization and how we can collaborate.</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-night/40 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        id="name"
                        placeholder="Juan Dela Cruz"
                        className="w-full rounded-2xl border border-border bg-ivory/50 px-5 py-4 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-night/40 ml-1">Work Email</label>
                      <input
                        required
                        type="email"
                        id="email"
                        placeholder="juan@organization.com"
                        className="w-full rounded-2xl border border-border bg-ivory/50 px-5 py-4 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-xs font-bold uppercase tracking-widest text-night/40 ml-1">Organization Name</label>
                    <input
                      required
                      type="text"
                      id="organization"
                      placeholder="Organization Inc."
                      className="w-full rounded-2xl border border-border bg-ivory/50 px-5 py-4 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="text-xs font-bold uppercase tracking-widest text-night/40 ml-1">Partnership Type</label>
                    <select
                      id="type"
                      className="w-full appearance-none rounded-2xl border border-border bg-ivory/50 px-5 py-4 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5"
                    >
                      <option>Clinic / Hospital Provider</option>
                      <option>Health Insurance Partner</option>
                      <option>Technology Integrator</option>
                      <option>Government / NGO</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-night/40 ml-1">Partnership Proposal</label>
                    <textarea
                      required
                      id="message"
                      rows={5}
                      placeholder="Briefly describe how you envision partnering with Lunas..."
                      className="w-full rounded-2xl border border-border bg-ivory/50 px-5 py-4 text-night outline-none transition-all focus:border-golden/30 focus:bg-white focus:ring-4 focus:ring-golden/5 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-night py-5 text-sm font-bold text-white transition-all hover:bg-night/90 hover:shadow-glow-sm active:scale-[0.98]"
                  >
                    Submit Inquiry
                    <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-golden/10 text-golden">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-3xl font-bold text-night">Inquiry Received</h2>
                    <p className="text-muted-foreground/60 max-w-xs mx-auto">
                      Thank you for your interest in partnering with Lunas. Our partnership team will review your details and reach out soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-semibold text-golden hover:underline decoration-golden/30 underline-offset-4"
                  >
                    Submit another inquiry
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
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
                    <Link href="/help-center" className="transition-colors hover:text-golden">
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
                    <Link href="/partnerships" className="transition-colors hover:text-golden text-golden font-medium">
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
