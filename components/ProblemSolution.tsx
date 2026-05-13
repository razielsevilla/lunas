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
    title: "Communication breakdown",
    description:
      "60% of ER patients arrive unable to communicate their medical history to first responders.",
  },
  {
    icon: FileX2,
    tag: "RECORDS",
    number: "02",
    title: "Siloed health systems",
    description:
      "Fragmented paper and digital systems across rural health units make data inaccessible.",
  },
  {
    icon: Pill,
    tag: "SAFETY",
    number: "03",
    title: "Preventable drug errors",
    description:
      "Adverse drug reactions caused by missing patient-specific allergy and medication data.",
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
      description: "Eliminate communication gaps. First responders see your critical history in seconds with a simple scan.",
    },
    {
      icon: ShieldCheck,
      title: "Unified Health ID",
      description: "Break down hospital silos. One secure passport that carries your data across every health system.",
    },
    {
      icon: Sparkles,
      title: "AI Safety Shield",
      description: "Prevent drug errors before they happen. Real-time flags for allergies and dangerous combinations.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative min-h-[850px] w-full overflow-hidden bg-ivory md:h-screen"
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
        <div className="problem-reveal relative flex flex-col justify-center border-r border-night/5 bg-[#8B3A3A]/[0.015] px-8 py-20 md:w-[45%] md:px-12 lg:px-24">
          <div className="mb-12">
            <div className="reveal-item inline-flex items-center gap-2 rounded-full bg-[#8B3A3A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B3A3A]">
              <AlertTriangle size={12} />
              The Problem
            </div>
            <h2 className="reveal-item mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tighter text-night lg:text-6xl">
              The information <br />
              <span className="text-[#8B3A3A]/80 italic">vacuum.</span>
            </h2>
            <p className="reveal-item mt-6 text-sm leading-relaxed text-muted-foreground/80 lg:text-base">
              When seconds count, medical teams are often left in the dark.
              Communication barriers cost lives.
            </p>
          </div>

          <div className="space-y-6">
            {problems.map((p) => (
              <div key={p.number} className="problem-card-anim">
                <div className="group relative flex items-start gap-5 rounded-2xl border border-night/[0.04] bg-white/70 p-6 transition-all duration-500 hover:border-[#8B3A3A]/20 hover:bg-white">
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
        <div className="solution-reveal relative flex flex-1 flex-col justify-center px-8 py-20 md:px-12 lg:px-24">
          <div className="mb-12">
            <div className="reveal-item inline-flex items-center gap-2 rounded-full bg-golden/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-golden">
              <Sparkles size={12} />
              The Solution
            </div>
            <h2 className="reveal-item mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tighter text-night lg:text-6xl">
              Meet Lunas. <br />
              <span className="text-golden italic">The antidote.</span>
            </h2>
            <p className="reveal-item mt-6 text-sm leading-relaxed text-muted-foreground/80 lg:text-base">
              A secure, editorial-grade health ID that bridges the gap between
              fragmented records and life-saving decisions.
            </p>
          </div>

          <div className="space-y-6">
            {solutions.map((s, idx) => (
              <div key={idx} className="solution-card-anim">
                <div className="group relative flex items-start gap-5 rounded-2xl border border-golden/10 bg-white/70 p-6 transition-all duration-500 hover:border-golden/40 hover:bg-white hover:shadow-soft-xl">
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
