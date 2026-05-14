"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Activity,
  AlertCircle,
  Heart,
  Pill as PillIcon,
  ShieldAlert,
  User,
} from "lucide-react";

function MedicalTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger";
}) {
  const toneColor =
    tone === "danger"
      ? "text-destructive"
      : tone === "warn"
        ? "text-amber-warm"
        : "text-sage";

  const toneBg =
    tone === "danger"
      ? "bg-destructive/10 border-destructive/20"
      : tone === "warn"
        ? "bg-amber-warm/10 border-amber-warm/20"
        : "bg-sage/10 border-sage/20";

  return (
    <div className={`flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300 hover:bg-white/5 hover:translate-y-[-2px] ${toneBg}`}>
      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-night/40 backdrop-blur-sm border border-white/5`}>
        <Icon className={`h-4 w-4 ${toneColor}`} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-moonlight/30">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-moonlight/90">{value}</div>
      </div>
    </div>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const leftElements = heroRef.current?.querySelectorAll(".hero-left-anim");
      const rightCard = heroRef.current?.querySelector(".hero-card-anim");
      const cardItems = heroRef.current?.querySelectorAll(".card-anim-item");

      if (leftElements) {
        tl.fromTo(
          leftElements,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }
        );
      }

      if (rightCard) {
        tl.fromTo(
          rightCard,
          { x: 40, opacity: 0, scale: 0.98 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.4"
        );
      }

      if (cardItems && cardItems.length > 0) {
        tl.fromTo(
          cardItems,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
          "-=0.6"
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="mx-auto max-w-6xl px-6 pb-32 pt-6 md:pb-40">
      <div className="grid items-center gap-12 md:gap-20 md:grid-cols-[1.1fr_0.9fr]">
        {/* Left — Copy */}
        <div>
          <h1 className="hero-left-anim font-display text-5xl font-semibold leading-[1.05] tracking-tighter text-night md:text-6xl lg:text-7xl text-balance opacity-0">
            Your medical passport,{" "}
            <em className="text-night/70">always with you.</em>
          </h1>

          <p className="hero-left-anim mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance opacity-0">
            <span style={{ color: '#CFA157' }} className="font-semibold">Lunas</span> encrypts your complete medical history into a permanent QR code that only verified medical professionals can access — giving emergency responders your full clinical context in seconds, not minutes.
          </p>

          <div className="hero-left-anim mt-12 flex flex-col gap-4 sm:flex-row sm:items-center opacity-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-12 rounded-full bg-night px-8 py-3.5 text-center text-sm font-semibold text-white transition-all hover:shadow-glow hover:scale-105 active:scale-95"
            >
              Create your passport
            </Link>
            <Link
              href="/scan/demo-mp-2026-00428"
              className="inline-flex items-center justify-center h-12 rounded-full border border-border bg-white px-8 py-3.5 text-center text-sm font-semibold text-night transition-all hover:border-golden/40 hover:shadow-soft hover:scale-105 active:scale-95"
            >
              Try a demo scan
            </Link>
          </div>
        </div>

        {/* Right — Hero Card with Anti-Gravity effect */}
        <div className="hero-card-anim group relative opacity-0">
          {/* 3D Halo Glow Background */}
          <div className="absolute -inset-10 animate-pulse rounded-[3rem] bg-gradient-to-br from-golden/20 via-transparent to-amber-glow/10 blur-[80px]" />
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-night/40 via-transparent to-white/5 blur-2xl" />

          {/* Main Passport Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-night/90 p-8 text-moonlight shadow-2xl backdrop-blur-2xl transition-all duration-500 group-hover:scale-[1.01] group-hover:border-white/20">

            {/* Animated Glass Reflection Beam */}
            <div className="pointer-events-none absolute -left-[100%] top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000 group-hover:left-[200%]" />

            {/* Top Glass Bar */}
            <div className="card-anim-item flex items-center justify-between opacity-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-glow opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-glow"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-moonlight/40">
                  Live Emergency View
                </span>
              </div>
              <div className="rounded-full border border-golden/20 bg-golden/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-golden">
                Verified Identity
              </div>
            </div>

            {/* Patient Profile */}
            <div className="card-anim-item mt-10 flex items-end justify-between opacity-0">
              <div>
                <h2 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
                  Maria Santos
                </h2>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium tracking-widest text-moonlight/40">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" /> 34 YEARS
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/10" />
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> O-NEGATIVE
                  </span>
                </div>
              </div>

            </div>

            {/* Decorative Divider */}
            <div className="card-anim-item my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0" />

            {/* Medical Data Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="card-anim-item opacity-0">
                <MedicalTile
                  icon={ShieldAlert}
                  label="Critical Allergy"
                  value="Penicillin"
                  tone="danger"
                />
              </div>
              <div className="card-anim-item opacity-0">
                <MedicalTile
                  icon={AlertCircle}
                  label="Food Allergy"
                  value="Shellfish"
                  tone="warn"
                />
              </div>
              <div className="card-anim-item opacity-0">
                <MedicalTile
                  icon={Activity}
                  label="Condition"
                  value="Chronic Asthma"
                  tone="warn"
                />
              </div>
              <div className="card-anim-item opacity-0">
                <MedicalTile
                  icon={PillIcon}
                  label="Medication"
                  value="Salbutamol"
                  tone="ok"
                />
              </div>
            </div>

            {/* Bottom Drawer: Emergency Contact */}
            <div className="card-anim-item opacity-0">
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:bg-white/[0.06]">
                <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-moonlight/30">
                    Primary Contact
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-base font-semibold">
                    Andres Santos
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase text-moonlight/40">
                      Spouse
                    </span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-golden/10 border border-golden/20">
                  <Heart className="h-4 w-4 text-golden" fill="currentColor" fillOpacity={0.1} />
                </div>
              </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-moonlight/50">
                  <span className="font-mono">+63 917 555 0142</span>
                </div>
              </div>
            </div>

            {/* Holographic "Scan" Line */}
            <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full animate-[scan_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-golden/40 to-transparent opacity-20" />
          </div>

        </div>
      </div>
    </section>
  );
}
