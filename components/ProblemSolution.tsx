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
  Fingerprint,
  UserCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────── */
/*  Data                                          */
/* ────────────────────────────────────────────── */

const problems = [
  {
    icon: AlertTriangle,
    tag: "EMERGENCY",
    number: "01",
    title: "Lost in translation",
    description:
      "Critical medical details vanish in moments that matter most. Unconscious patients can't speak. Records are scattered or inaccessible.",
  },
  {
    icon: FileX2,
    tag: "RECORDS",
    number: "02",
    title: "Fragmented health data",
    description:
      "Your medical history is locked across hospitals, clinics, and digital silos. No single source of truth when seconds count.",
  },
  {
    icon: Pill,
    tag: "SAFETY",
    number: "03",
    title: "Preventable adverse reactions",
    description:
      "Medication errors and allergy conflicts occur because doctors lack complete patient context. Tragedy by incomplete information.",
  },
];

/* ────────────────────────────────────────────── */
/*  Sub-components                                */
/* ────────────────────────────────────────────── */



/* ────────────────────────────────────────────── */
/*  Main Component                                */
/* ────────────────────────────────────────────── */

export function ProblemSolution() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Headings & Text (Left Side)
      gsap.from(".problem-reveal .reveal-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-reveal",
          start: "top 85%",
        },
      });

      // 2. Reveal Problem Cards
      gsap.from(".problem-card-anim", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-reveal",
          start: "top 75%",
        },
      });

      // 3. Reveal Headings & Text (Right Side)
      gsap.from(".solution-reveal .reveal-item", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".solution-reveal",
          start: "top 85%",
        },
      });

      // 4. Reveal Solution Cards
      gsap.from(".solution-card-anim", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".solution-reveal",
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const solutions = [
    {
      icon: QrCode,
      title: "Instant QR Access",
      description: "One scannable code gives verified medical professionals instant access to your complete medical history — no delays, no miscommunication.",
    },
    {
      icon: ShieldCheck,
      title: "Unified Medical Passport",
      description: "Your complete health data in one place. Every scan triggers an immediate alert to your emergency contacts, keeping your loved ones informed.",
    },
    {
      icon: Sparkles,
      title: "Drug Interaction Protection",
      description: "Real-time safety alerts flag dangerous medication combinations and allergies at the point of care — preventing adverse reactions before they happen.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative min-h-[900px] w-full overflow-hidden bg-ivory md:h-screen"
    >
      {/* Shared Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #0B1120 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="split-content relative flex h-full w-full flex-col md:flex-row">

        {/* ═══════════════ THE PROBLEM (Left) ═══════════════ */}
        <div className="problem-reveal relative flex flex-col justify-center border-r border-night/5 bg-[#8B3A3A]/[0.015] px-6 py-24 md:w-1/2 md:px-12 lg:px-20">
          <div className="mb-12">
            <div className="reveal-item inline-flex items-center gap-2 rounded-full bg-[#8B3A3A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B3A3A]">
              <AlertTriangle size={12} />
              The Problem
            </div>
            <h2 className="reveal-item mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tighter text-night lg:text-6xl">
              The information <br />
              <span className="text-[#8B3A3A]/80 italic">vacuum.</span>
            </h2>
            <p className="reveal-item mt-6 text-base leading-relaxed text-muted-foreground/80">
              When seconds count, medical teams are often left in the dark.
              Communication barriers cost lives.
            </p>
          </div>

          <div className="space-y-5">
            {problems.map((p) => (
              <div key={p.number} className="problem-card-anim">
                <div className="group relative flex items-start gap-5 rounded-2xl border border-night/[0.04] bg-white/70 p-5 transition-all duration-500 hover:border-[#8B3A3A]/20 hover:bg-white">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8B3A3A]/[0.05] text-[#8B3A3A]/60 transition-colors group-hover:bg-[#8B3A3A]/10 group-hover:text-[#8B3A3A]">
                    <p.icon size={24} strokeWidth={1.2} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-night">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground/70">
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ THE SOLUTION (Right) ═══════════════ */}
        <div className="solution-reveal relative flex flex-col justify-center px-6 py-24 md:w-1/2 md:px-12 lg:px-20">
          <div className="mb-12">
            <div className="reveal-item inline-flex items-center gap-2 rounded-full bg-golden/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-golden">
              <Sparkles size={12} />
              The Solution
            </div>
            <h2 className="reveal-item mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tighter text-night lg:text-6xl">
              Meet Lunas. <br />
              <span className="text-golden italic">The antidote.</span>
            </h2>
            <p className="reveal-item mt-6 text-base leading-relaxed text-muted-foreground/80">
              A secure medical passport that bridges the gap between
              fragmented records and life-saving decisions.
            </p>
          </div>

          <div className="space-y-5">
            {solutions.map((s, idx) => (
              <div key={idx} className="solution-card-anim">
                <div className="group relative flex items-start gap-5 rounded-2xl border border-golden/10 bg-white/70 p-5 transition-all duration-500 hover:border-golden/40 hover:bg-white hover:shadow-soft-xl">
                  {/* Decorative glow */}
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-golden/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

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
