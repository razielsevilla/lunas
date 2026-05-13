"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  FileX2,
  Pill,
  QrCode,
  ShieldCheck,
  Sparkles,
  Bell,
  Lock,
  ArrowDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────── */
/*  Data                                          */
/* ────────────────────────────────────────────── */

const problems = [
  {
    icon: AlertTriangle,
    stat: "60%",
    label: "of ER patients",
    description: "arrive unable to communicate their medical history.",
  },
  {
    icon: FileX2,
    stat: "Siloed",
    label: "health records",
    description:
      "Fragmented paper and digital systems across rural health units.",
  },
  {
    icon: Pill,
    stat: "Preventable",
    label: "medication errors",
    description:
      "Adverse drug reactions caused by missing patient-specific data.",
  },
];

const solutions = [
  {
    icon: QrCode,
    title: "QR-Based Access",
    body: "One permanent code on a card, tag, or phone lock screen — scanned instantly by any first responder.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Professional Access",
    body: "PRC-licensed medical professionals use a uniquely identifiable PIN to decrypt patient data.",
  },
  {
    icon: Sparkles,
    title: "AI Drug Interaction Checker",
    body: "Real-time flagging of dangerous medication combinations at the point of care.",
  },
  {
    icon: Bell,
    title: "Emergency Contact Alerts",
    body: "Automated notifications sent to loved ones the moment a profile is accessed.",
  },
  {
    icon: Lock,
    title: "AES-256 Encryption & Audit Log",
    body: "Military-grade encryption for data at rest, with an immutable log of every access event.",
  },
];

/* ────────────────────────────────────────────── */
/*  Component                                     */
/* ────────────────────────────────────────────── */

export function ProblemSolution() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Problem cards stagger in ── */
      gsap.from(section.querySelectorAll(".problem-card"), {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: problemRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* ── Bridge animation ── */
      gsap.from(section.querySelectorAll(".bridge-el"), {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: bridgeRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* ── Solution cards stagger in ── */
      gsap.from(section.querySelectorAll(".solution-card"), {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: solutionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* ── Heading reveals ── */
      gsap.from(section.querySelectorAll(".ps-heading"), {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative overflow-hidden"
    >
      {/* ═══════════════ PROBLEM ═══════════════ */}
      <div className="relative bg-ivory">
        {/* Decorative glow orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-[#8B3A3A]/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-[15%] h-64 w-64 rounded-full bg-amber-glow/[0.04] blur-[100px]" />

        <div className="mx-auto max-w-6xl px-6 py-24">
          {/* Problem heading */}
          <div className="mb-16">
            <h2 className="ps-heading font-display text-4xl font-bold leading-[1.05] tracking-tighter text-night sm:text-5xl md:text-6xl lg:text-7xl">
              The information vacuum
            </h2>
            <p
              className="ps-heading mt-2 pb-2 font-display text-4xl font-bold leading-[1.15] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                background:
                  "linear-gradient(135deg, #D4736E 0%, #B54A4A 50%, #8B3A3A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in emergency care.
            </p>
            <p className="ps-heading mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              When patients arrive at emergency rooms unconscious or
              incapacitated, medical teams are left in the dark — without access
              to allergies, medications, or pre-existing conditions. In the
              Philippines, fragmented healthcare records make this gap even
              deadlier.
            </p>
          </div>

          {/* Problem stat cards */}
          <div ref={problemRef} className="grid gap-5 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.label} className="problem-card">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-white transition-all duration-500 hover:border-[#D4736E]/20 hover:shadow-soft-lg hover:-translate-y-1">
                  {/* Top accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#D4736E]/40 via-[#B54A4A]/20 to-transparent" />

                  <div className="p-7">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-br from-ivory to-ivory-warm shadow-sm transition-all duration-300 group-hover:border-[#D4736E]/15 group-hover:bg-[#D4736E]/[0.08]">
                      <p.icon
                        className="h-5 w-5 text-night/50 transition-colors duration-300 group-hover:text-[#D4736E]"
                        strokeWidth={1.4}
                      />
                    </div>

                    {/* Stat */}
                    <div className="mt-5">
                      <span className="font-display text-3xl font-bold tracking-tight text-night/90">
                        {p.stat}
                      </span>
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        {p.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>

                    {/* Bottom decorative */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent transition-all duration-500 group-hover:from-[#D4736E]/30" />
                      <div className="h-1.5 w-1.5 rounded-full bg-border transition-colors duration-500 group-hover:bg-[#D4736E]/30" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ BRIDGE / TRANSITION ═══════════════ */}
      <div
        ref={bridgeRef}
        className="relative flex flex-col items-center justify-center bg-ivory py-16"
      >
        {/* Decorative lines */}
        <div className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-night/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-t from-golden/20 to-transparent" />

        <div className="bridge-el flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white shadow-soft">
          <ArrowDown
            className="h-5 w-5 text-golden"
            strokeWidth={1.5}
          />
        </div>
        <p className="bridge-el mt-4 text-center font-display text-lg font-semibold tracking-tight text-night">
          There is a better way.
        </p>
      </div>

      {/* ═══════════════ SOLUTION ═══════════════ */}
      <div className="relative bg-ivory">
        {/* Decorative glow orbs */}
        <div className="pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-golden/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-20 left-[10%] h-64 w-64 rounded-full bg-amber-glow/[0.04] blur-[100px]" />

        <div className="mx-auto max-w-6xl px-6 pb-24">
          {/* Solution heading */}
          <div className="mb-16">
            <div className="ps-heading mb-4 inline-flex items-center gap-2 rounded-full border border-golden/15 bg-golden/[0.06] px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-golden" strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-golden">
                The Solution
              </span>
            </div>
            <h2 className="ps-heading font-display text-4xl font-bold leading-[1.05] tracking-tighter text-night sm:text-5xl md:text-6xl lg:text-7xl">
              Meet Lunas.
            </h2>
            <p
              className="ps-heading mt-2 pb-2 font-display text-4xl font-bold leading-[1.15] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                background:
                  "linear-gradient(135deg, #C49A6C 0%, #D4A44E 50%, #C8956C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your medical passport.
            </p>
            <p className="ps-heading mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A secure, web-based emergency medical information system designed
              to provide immediate, point-of-care access to a patient&apos;s
              critical health data — bridging the gap between fragmented records
              and life-saving decisions.
            </p>
          </div>

          {/* Solution feature cards */}
          <div ref={solutionRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <div
                key={s.title}
                className={`solution-card ${
                  /* Last card spans full width on 3-col when odd count */
                  i === solutions.length - 1 && solutions.length % 3 !== 0
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-white transition-all duration-500 hover:border-golden/25 hover:shadow-soft-lg hover:-translate-y-1">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-golden/50 via-amber-glow/30 to-transparent" />

                  <div className="p-7">
                    {/* Tag + Number row */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-golden/15 bg-golden/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-golden">
                        Solution
                      </span>
                      <span className="font-display text-3xl font-bold tracking-tighter text-night/[0.06]">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-br from-ivory to-ivory-warm shadow-sm transition-all duration-300 group-hover:border-golden/20 group-hover:shadow-glow">
                      <s.icon
                        className="h-6 w-6 text-night/50 transition-colors duration-300 group-hover:text-golden"
                        strokeWidth={1.4}
                      />
                    </div>

                    {/* Text content */}
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-night">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>

                    {/* Bottom decorative element */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent transition-all duration-500 group-hover:from-golden/30" />
                      <div className="h-1.5 w-1.5 rounded-full bg-border transition-colors duration-500 group-hover:bg-golden/50" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
