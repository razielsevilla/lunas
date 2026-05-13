/**
 * Lunas Landing Page — "Quiet Luxury" Premium Healthcare
 * Next.js App Router · Server Component
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ScrollRevealFeatures } from "@/components/ScrollRevealFeatures";
import { ProblemSolution } from "@/components/ProblemSolution";
import {
  Mail,
  ArrowRight,
  MapPin,
  UserPlus,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lunas — Your medical passport, always with you",
  description:
    "Lunas is a secure medical passport that gives first responders the right information at the right moment — through a single QR code.",
};

/* ────────────────────────────────────────────── */
/*  Data                                          */
/* ────────────────────────────────────────────── */

const steps = [
  {
    icon: UserPlus,
    title: "Build your profile",
    body: "Sign up and complete your encrypted medical record in a guided builder.",
    tag: "Setup",
  },
  {
    icon: QrCode,
    title: "Carry your QR code",
    body: "Save it to your phone, print it on a card, or laminate it for your wallet.",
    tag: "Carry",
  },
  {
    icon: ShieldCheck,
    title: "Be safe in an emergency",
    body: "Verified responders scan, enter their PIN, and treat you with full context.",
    tag: "Protect",
  },
] as const;

/* ────────────────────────────────────────────── */
/*  Pill Component                                */
/* ────────────────────────────────────────────── */

function Pill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger";
}) {
  const toneCls =
    tone === "danger"
      ? "border-[#8B3A3A]/25 bg-[#8B3A3A]/8"
      : tone === "warn"
        ? "border-amber-glow/20 bg-amber-glow/8"
        : "border-sage/20 bg-sage/8";
  return (
    <div className={`rounded-xl border px-3 py-2 ${toneCls}`}>
      <div className="text-[10px] uppercase tracking-wider text-moonlight/50">
        {label}
      </div>
      <div className="text-sm font-medium text-moonlight/90">{value}</div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Page                                          */
/* ────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory font-sans">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo variant="light" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a
            href="#why"
            className="transition-colors hover:text-foreground"
          >
            Why Lunas
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#trust" className="transition-colors hover:text-foreground">
            Trust &amp; security
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground transition-colors hover:text-golden"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-night px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-glow"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-28 pt-16 md:pt-28">
        <div className="grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left — Copy */}
          <div>

            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tighter text-night md:text-7xl text-balance">
              Your medical passport,{" "}
              <em className="text-night/70">always with you.</em>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
              Lunas turns critical health information into a permanent QR code
              only verified medical professionals can read — so the people who
              treat you in an emergency see what matters in seconds.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-night px-7 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-glow"
              >
                Create your passport
              </Link>
              <Link
                href="/scan/demo-mp-2026-00428"
                className="rounded-full border border-border bg-white px-7 py-3.5 text-sm font-semibold text-night transition-all hover:border-golden/40 hover:shadow-soft"
              >
                Try a demo scan
              </Link>
            </div>

          </div>

          {/* Right — Hero Card with Anti-Gravity effect */}
          <div className="relative">
            {/* Gradient blur behind card (3D Anti-Gravity glow) */}
            <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-amber-glow/25 via-transparent to-golden/15 blur-3xl" />
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-night/10 via-transparent to-amber-glow/10 blur-2xl" />

            {/* Emergency View Card — Glassmorphism */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night p-8 text-moonlight shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              {/* Subtle inner glass highlights */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-golden/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-amber-glow/5 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between text-xs text-moonlight/50">
                  <span className="font-sans font-medium uppercase tracking-widest">
                    Emergency View
                  </span>
                  <span className="rounded-full bg-amber-glow/15 px-2.5 py-0.5 font-medium text-amber-glow">
                    Verified
                  </span>
                </div>

                <div className="mt-5 font-display text-3xl font-semibold tracking-tight">
                  Maria Santos, 34
                </div>
                <div className="mt-1 text-sm text-moonlight/50">
                  Blood Type · O−&nbsp;&nbsp;|&nbsp;&nbsp;Organ Donor · Yes
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <Pill label="Allergy" value="Penicillin" tone="danger" />
                  <Pill label="Allergy" value="Shellfish" tone="warn" />
                  <Pill label="Condition" value="Asthma" tone="warn" />
                  <Pill label="Medication" value="Salbutamol" tone="ok" />
                </div>

                {/* Emergency contact — frosted glass layer */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-glass">
                  <div className="text-[11px] font-medium uppercase tracking-widest text-moonlight/40">
                    Emergency contact
                  </div>
                  <div className="mt-1.5 text-base font-medium">
                    Andres Santos · Spouse
                  </div>
                  <div className="text-sm text-moonlight/50">
                    +63 917 555 0142
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PROBLEM & SOLUTION ═══════════════ */}
      <ProblemSolution />

      {/* ═══════════════ FEATURES ═══════════════ */}
      <ScrollRevealFeatures />

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how" className="bg-ivory">
        <div className="mx-auto max-w-6xl px-6 py-24">
          {/* Section heading */}
          <div className="mb-16 flex flex-col items-start text-left">
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tighter text-night sm:text-5xl md:text-6xl lg:text-7xl">
              How it works
            </h2>
            <p
              className="mt-2 font-display text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                background:
                  "linear-gradient(135deg, #C49A6C 0%, #D4A44E 50%, #C8956C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in three simple steps.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              From sign-up to life-saving scan — Lunas is designed to be
              effortless for you and instant for the people who help you.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-white transition-all duration-500 hover:border-golden/25 hover:shadow-soft-lg hover:-translate-y-1">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-golden/50 via-amber-glow/30 to-transparent" />

                  <div className="p-7">
                    {/* Tag + Number row */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-golden/15 bg-golden/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-golden">
                        {s.tag}
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
      </section>

      {/* ═══════════════ TRUST ═══════════════ */}
      <section id="trust" className="bg-night text-moonlight">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tighter md:text-5xl text-balance">
            Privacy isn&apos;t a feature.
            <br />It&apos;s the foundation.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-moonlight/50">
            Every record is AES-256 encrypted. Access requires a 6-digit
            professional PIN. Every scan is logged and your emergency contacts
            are notified the moment anyone opens your record.
          </p>
          <Link
            href="/register"
            className="mt-12 inline-flex rounded-full bg-amber-glow px-7 py-3.5 text-sm font-semibold text-night transition-all hover:shadow-moon"
          >
            Create your free passport
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
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
                    <a href="#features" className="transition-colors hover:text-golden">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how" className="transition-colors hover:text-golden">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="#trust" className="transition-colors hover:text-golden">
                      Security
                    </a>
                  </li>
                  <li>
                    <Link href="/scan/demo-mp-2026-00428" className="transition-colors hover:text-golden">
                      Demo scan
                    </Link>
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
                    <a href="#" className="transition-colors hover:text-golden">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Status
                    </a>
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
                    <a href="#" className="transition-colors hover:text-golden">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Data Processing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Cookie Policy
                    </a>
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
                    <a href="#" className="transition-colors hover:text-golden">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Partnerships
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-golden">
                      Press Kit
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Newsletter CTA bar ── */}
        <div className="mx-auto max-w-6xl px-6 mb-10">
          <div className="rounded-2xl border border-border/50 bg-white px-8 py-6 shadow-soft">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/10">
                  <Mail className="h-5 w-5 text-golden" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-night">
                    Stay informed
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Product updates, security advisories, and healthcare news.
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-3 md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-night placeholder-muted-foreground/50 outline-none transition-colors focus:border-golden/30 focus:ring-1 focus:ring-golden/20"
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-night px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow">
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ── Bottom bar ── */}
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
            <div className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Lunas · Team Otso-Otso · A SIKAPTala
              Ideathon project
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
              <a href="#" className="transition-colors hover:text-golden">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-golden">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-golden">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
