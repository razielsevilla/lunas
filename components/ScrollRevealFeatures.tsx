"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Smartphone,
  History,
  Activity,
  ArrowRight,
  Command,
  Plus,
  QrCode,
  FileText,
  Wallet,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Words that cycle in the hero heading ── */
const cyclingWords = [
  "that matter most.",
  "when seconds count.",
  "that save lives.",
  "that define care.",
];

export function ScrollRevealFeatures() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLSpanElement>(null);

  const [currentWord, setCurrentWord] = useState(0);

  /* ── Cycling word animation ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % cyclingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  /* ── GSAP word-change animation ── */
  useEffect(() => {
    const el = cycleRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 50, opacity: 0, rotateX: -45 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.65,
        ease: "power3.out",
      }
    );
  }, [currentWord]);

  /* ── Reveal animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll(".hero-line"), {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 90%",
          },
        });
      }

      // Cards entrance
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.querySelectorAll(".bento-card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
            },
            clearProps: "all",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-ivory py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* HEADING */}
        <div ref={heroRef} className="mb-12 max-w-3xl">
          <h2 className="hero-line font-display text-5xl font-bold leading-[1.05] tracking-tighter text-night md:text-7xl">
            Built for the moments
          </h2>
          <div
            className="hero-line mt-2 overflow-hidden"
            style={{ perspective: "600px", minHeight: "1.3em" }}
          >
            <span
              ref={cycleRef}
              key={currentWord}
              className="inline-block font-display text-5xl font-bold tracking-tighter text-golden italic md:text-7xl"
            >
              {cyclingWords[currentWord]}
            </span>
          </div>
          <p className="hero-line mt-6 text-lg leading-relaxed text-muted-foreground/80">
            A medical passport designed for resilience. We stripped away the 
            complexity to focus on the four pillars of emergency readiness.
          </p>
        </div>

        {/* BENTO GRID */}
        <div 
          ref={cardsRef}
          className="grid gap-4 md:grid-cols-12 md:grid-rows-2"
        >
          {/* 1. Complete Medical Context (Wide) - NOW WHITE */}
          <div className="bento-card group relative overflow-hidden rounded-3xl bg-white p-8 text-night md:col-span-8 md:row-span-1 border border-border/50 shadow-soft transition-all duration-700 hover:scale-[1.01]">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-night/5">
                  <Activity size={18} className="text-golden" />
                </div>
                <h3 className="font-semibold text-night">Complete Medical Context</h3>
              </div>
              <p className="mt-3 max-w-md text-sm text-muted-foreground/70">
                Beyond basic IDs. Lunas carries your full clinical context — allergies, medications, and surgical history.
              </p>
              
              {/* Mini Dashboard UI Mockup */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-night/[0.02] border border-border/50 p-4 transition-colors group-hover:bg-night/[0.05]">
                  <div className="text-[10px] uppercase tracking-wider text-night/30">Blood Type</div>
                  <div className="mt-1 text-xl font-bold text-golden">O- Negative</div>
                </div>
                <div className="rounded-xl bg-night/[0.02] border border-border/50 p-4 transition-colors group-hover:bg-night/[0.05]">
                  <div className="text-[10px] uppercase tracking-wider text-night/30">Allergies</div>
                  <div className="mt-1 text-xl font-bold text-[#D4736E]">Penicillin +2</div>
                </div>
                <div className="rounded-xl bg-night/[0.02] border border-border/50 p-4 transition-colors group-hover:bg-night/[0.05]">
                  <div className="text-[10px] uppercase tracking-wider text-night/30">Conditions</div>
                  <div className="mt-1 text-xl font-bold text-night">Asthma</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Real-time Awareness (Tall) - WHITE */}
          <div className="bento-card group relative overflow-hidden rounded-3xl bg-white p-8 text-night md:col-span-4 md:row-span-2 border border-border/50 shadow-soft transition-all duration-700 hover:scale-[1.01]">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-night/5">
                  <History size={18} className="text-golden" />
                </div>
                <h3 className="font-semibold text-night">Real-time Awareness</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70">
                Optimized for speed at any scale.
              </p>

              <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter text-night">2.1s</span>
                  <span className="text-sm font-medium text-night/30 uppercase tracking-widest">Avg Scan</span>
                </div>
                {/* Progress bar style element */}
                <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-night/5">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-golden to-amber-warm shadow-glow-sm transition-all duration-1000 group-hover:w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Privacy & Shortcuts (Medium) - WHITE */}
          <div className="bento-card group relative overflow-hidden rounded-3xl bg-white p-8 text-night md:col-span-4 md:row-span-1 border border-border/50 shadow-soft transition-all duration-700 hover:scale-[1.01]">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-night/5">
                  <ShieldCheck size={18} className="text-golden" />
                </div>
                <h3 className="font-semibold text-night">Data Sovereignty</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70">
                Your data is yours. Military-grade encryption.
              </p>

              <div className="mt-8 flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-night/5 border border-border transition-transform group-hover:scale-110">
                  <Command size={20} className="text-night/20" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-night/5 border border-border text-lg font-bold text-night/20 transition-transform group-hover:scale-110">
                  K
                </div>
              </div>
            </div>
          </div>

          {/* 4. Multi-Format Integrations (Wide) - WHITE */}
          <div className="bento-card group relative overflow-hidden rounded-3xl bg-white p-8 text-night md:col-span-4 md:row-span-1 border border-border/50 shadow-soft transition-all duration-700 hover:scale-[1.01]">
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-night/5">
                  <Smartphone size={18} className="text-golden" />
                </div>
                <h3 className="font-semibold text-night">Multi-Format Access</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground/70">
                Wallet, Print, and Cloud integrations.
              </p>

              <div className="mt-8 flex gap-3 overflow-hidden">
                {[Wallet, QrCode, FileText, Smartphone].map((Icon, idx) => (
                  <div key={idx} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-night/5 border border-border/50 transition-colors hover:bg-night/10">
                    <Icon size={18} className="text-night/10" />
                  </div>
                ))}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-night/5 border border-border/50">
                  <Plus size={16} className="text-night/10" />
                </div>
              </div>
              
              <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-night/30">
                <span>View all formats</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
