"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  UserPlus,
  QrCode,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    id: "setup",
    icon: UserPlus,
    title: "Build your profile",
    subtitle: "Guided medical record builder",
    description: "Our guided onboarding process takes the complexity out of medical history. We walk you through every critical detail—from allergies to blood types—ensuring your profile is comprehensive, accurate, and military-grade encrypted.",
    capabilities: [
      "AES-256 encrypted storage",
      "Guided health history survey",
      "Medical document uploads"
    ],
    accent: "Setup"
  },
  {
    id: "carry",
    icon: QrCode,
    title: "Carry your passport",
    subtitle: "Digital and physical formats",
    description: "Your Lunas passport is built for ultimate accessibility. Whether you prefer a digital-first approach with Apple Wallet, or a fail-safe physical backup like a laminated ID card, your life-saving information is always within reach.",
    capabilities: [
      "Apple & Google Wallet support",
      "High-res printable PDF export",
      "Permanent UUID assignment"
    ],
    accent: "Carry"
  },
  {
    id: "protect",
    icon: ShieldCheck,
    title: "Stay protected",
    subtitle: "Life-saving context in seconds",
    description: "The moment a verified medical professional scans your code, you are no longer just a patient—you are a person with a history. Responders gain instant access to the context they need to make safe, informed decisions.",
    capabilities: [
      "PRC-verified professional access",
      "Real-time scan notifications",
      "Family emergency alerts"
    ],
    accent: "Protect"
  }
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Animation for preview area when tab changes
  useEffect(() => {
    if (!previewRef.current) return;

    gsap.fromTo(
      previewRef.current.querySelectorAll(".preview-content"),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section id="how" className="relative bg-ivory py-32 overflow-hidden text-night">
      {/* Background elements */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-golden/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-amber-glow/[0.04] blur-[100px]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">

          {/* Left Column - Navigation */}
          <div className="flex flex-col justify-center">
            <div className="mb-12">
              <h2 className="font-display text-5xl font-bold tracking-tighter sm:text-6xl text-night">
                How it works.
              </h2>
              <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
                From sign-up to life-saving scan — Lunas is designed to be effortless for you and instant for the people who help you.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`group relative z-20 w-full rounded-3xl border p-7 text-left transition-all duration-700 cursor-pointer ${activeTab === index
                      ? "bg-white border-golden/40 shadow-soft-xl scale-[1.02] ring-1 ring-golden/10"
                      : "bg-transparent border-border hover:border-golden/30 hover:bg-white/60 hover:shadow-soft"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-display text-xl font-semibold tracking-tight transition-colors ${activeTab === index ? "text-night" : "text-night/50 group-hover:text-night"}`}>
                        {step.title}
                      </h3>
                      <p className={`mt-1 text-sm transition-colors ${activeTab === index ? "text-muted-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground/60"}`}>
                        {step.subtitle}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 ${activeTab === index
                        ? "bg-night border-night text-white shadow-glow-sm"
                        : "bg-white border-border text-night/30 group-hover:border-golden/30 group-hover:text-night"
                      }`}>
                      <ArrowRight size={20} className={activeTab === index ? "scale-110" : "group-hover:translate-x-0.5 transition-transform"} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Preview Area */}
          <div className="relative flex">
            <div
              ref={previewRef}
              className="relative flex w-full flex-col rounded-[2.5rem] border border-border/40 bg-white/80 p-8 backdrop-blur-md shadow-soft-2xl overflow-hidden h-full"
            >
              {/* Decorative elements in preview */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-golden/5 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-glow/5 blur-3xl" />

              <div
                key={activeTab}
                className="relative z-10 flex h-full flex-col"
              >
                <div className="preview-content">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-night mb-1">
                    {steps[activeTab].title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black uppercase tracking-tighter text-golden italic">
                      {steps[activeTab].accent}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
                      Phase {activeTab + 1}
                    </span>
                  </div>
                </div>

                <div className="preview-content mb-8">
                  <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                    {steps[activeTab].description}
                  </p>
                </div>

                <div className="preview-content mt-8 rounded-2xl bg-ivory/50 border border-border/40 p-6">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-golden mb-4 block">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-3">
                    {steps[activeTab].capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center gap-4 text-night group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-golden shadow-glow-sm group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm font-medium">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step indicator (Large faded number) */}
              <div className="absolute -bottom-6 -right-2 font-display text-[12rem] font-black text-night/[0.02] leading-none select-none pointer-events-none">
                0{activeTab + 1}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
