"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Users,
  Code,
  HeartPulse,
  ChevronRight
} from "lucide-react";

export default function CareersPage() {
  const openRoles = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote (Philippines)",
      type: "Full-time",
      icon: Code,
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote (Philippines)",
      type: "Full-time",
      icon: Briefcase,
    },
    {
      title: "Healthcare Integration Specialist",
      department: "Operations",
      location: "Manila, Philippines",
      type: "Full-time",
      icon: HeartPulse,
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      icon: Users,
    }
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
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tighter text-night md:text-6xl lg:text-7xl">
            Join the <br />
            <span className="text-golden italic">mission.</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground/80 text-balance mx-auto">
            Help us build the future of secure, accessible medical passports.
            We&apos;re looking for passionate individuals who care deeply about privacy, design, and saving lives.
          </p>
        </div>

        {/* Roles List */}
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="mb-8 flex items-center justify-between border-b border-night/5 pb-4">
            <h2 className="font-display text-2xl font-bold text-night">Open Roles</h2>
            <span className="text-sm font-medium text-golden bg-golden/10 px-3 py-1 rounded-full">{openRoles.length} Positions</span>
          </div>

          {openRoles.map((role, idx) => (
            <div key={idx} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-golden/10 bg-white/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-xl cursor-pointer">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-golden/[0.05] text-golden/60 transition-colors group-hover:bg-golden/10 group-hover:text-golden">
                  <role.icon size={24} strokeWidth={1.2} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-night group-hover:text-golden transition-colors">
                    {role.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground/70">
                    <span className="flex items-center gap-1.5"><Briefcase size={14} /> {role.department}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {role.location}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{role.type}</span>
                  </div>
                </div>
              </div>
              <div className="md:ml-auto pl-[4.25rem] md:pl-0 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-night/5 text-night transition-transform group-hover:bg-golden group-hover:text-night group-hover:scale-110">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 rounded-2xl bg-golden/5 border border-golden/10 p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-night mb-2">Don&apos;t see a perfect fit?</h3>
            <p className="text-muted-foreground/80 mb-6 max-w-md mx-auto text-sm">
              We&apos;re always looking for talented people. Send your resume and a brief intro to our team.
            </p>
            <a href="mailto:careers@lunas.app" className="inline-flex rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-night/90 hover:shadow-glow-sm">
              Email us
            </a>
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
                    <Link href="/partnerships" className="transition-colors hover:text-golden">
                      Partnerships
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="transition-colors hover:text-golden text-golden font-medium">Careers</Link>
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
