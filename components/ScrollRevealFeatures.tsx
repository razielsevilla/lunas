"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  QrCode,
  HeartPulse,
  Bell,
  Sparkles,
  Lock,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: HeartPulse,
    title: "Encrypted medical profile",
    body: "Allergies, medications & emergency contacts — AES-256 encrypted.",
    tag: "Security",
  },
  {
    icon: QrCode,
    title: "Permanent QR passport",
    body: "One UUID-linked QR code, printable or on your phone. Never expires.",
    tag: "Identity",
  },
  {
    icon: ShieldCheck,
    title: "PRC-verified access",
    body: "Only licensed professionals with a valid PIN can decrypt your record.",
    tag: "Verification",
  },
  {
    icon: Sparkles,
    title: "AI drug interaction",
    body: "Get warned about dangerous medication combinations automatically.",
    tag: "Intelligence",
  },
  {
    icon: Bell,
    title: "Emergency alerts",
    body: "Your loved ones get notified the instant your record is opened.",
    tag: "Alerts",
  },
  {
    icon: Lock,
    title: "Access transparency",
    body: "Every scan is timestamped and viewable in your access log.",
    tag: "Audit",
  },
] as const;

/* ── Words that cycle in the hero heading ── */
const cyclingWords = [
  "that matter most.",
  "when seconds count.",
  "that save lives.",
  "that define care.",
];

export function ScrollRevealFeatures() {
  const heroRef = useRef<HTMLDivElement>(null);
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

  /* ── Hero heading entrance ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      gsap.from(hero.querySelectorAll(".hero-line"), {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: hero,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-ivory"
    >
      {/* Background glow accents */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-golden/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 left-[10%] h-72 w-72 rounded-full bg-amber-glow/[0.05] blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* ═══════════════════════════════════════════════
            HEADING — left aligned
        ═══════════════════════════════════════════════ */}
        <div ref={heroRef} className="mb-12 flex flex-col items-start text-left">
          <h2 className="hero-line font-display text-4xl font-bold leading-[1.05] tracking-tighter text-night sm:text-5xl md:text-6xl lg:text-7xl">
            Built for the moments
          </h2>

          {/* Cycling word */}
          <div
            className="hero-line mt-2 overflow-hidden"
            style={{ perspective: "600px", minHeight: "1.3em" }}
          >
            <span
              ref={cycleRef}
              key={currentWord}
              className="inline-block font-display text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                background:
                  "linear-gradient(135deg, #C49A6C 0%, #D4A44E 50%, #C8956C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {cyclingWords[currentWord]}
            </span>
          </div>

          <p className="hero-line mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Six integrated capabilities — from encrypted profiles to PRC
            re-validation — working together so your information is accurate,
            private, and instantly available.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            CARDS — 3-column grid, all visible
        ═══════════════════════════════════════════════ */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, index) => (
            <div key={f.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-white transition-all duration-500 hover:border-golden/25 hover:shadow-soft-lg hover:-translate-y-1">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-golden/50 via-amber-glow/30 to-transparent" />

                <div className="p-7">
                  {/* Tag + Number row */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-golden/15 bg-golden/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-golden">
                      {f.tag}
                    </span>
                    <span className="font-display text-3xl font-bold tracking-tighter text-night/[0.06]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-gradient-to-br from-ivory to-ivory-warm shadow-sm transition-all duration-300 group-hover:border-golden/20 group-hover:shadow-glow">
                    <f.icon
                      className="h-6 w-6 text-night/50 transition-colors duration-300 group-hover:text-golden"
                      strokeWidth={1.4}
                    />
                  </div>

                  {/* Text content */}
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-night">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
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
    </section>
  );
}
