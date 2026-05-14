/**
 * Lunas Landing Page — "Quiet Luxury" Premium Healthcare
 * Next.js App Router · Server Component
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ScrollRevealFeatures } from "@/components/ScrollRevealFeatures";
import { ProblemSolution } from "@/components/ProblemSolution";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQTestimonials } from "@/components/FAQTestimonials";
import { MockupImages } from "@/components/MockupImages";
import { TextReveal } from "@/components/TextReveal";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import {
  Mail,
  ArrowRight,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lunas — Your medical passport, always with you",
  description:
    "Lunas is a secure medical passport that gives first responders the right information at the right moment — through a single QR code.",
};

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
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#why"
            className="transition-colors hover:text-foreground"
          >
            Why Lunas
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#trust" className="transition-colors hover:text-foreground">
            Trust &amp; Security
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-foreground transition-colors hover:text-golden sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-11 rounded-full bg-night px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow hover:scale-105 active:scale-95"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <Hero />

      {/* ═══════════════ FEATURES ═══════════════ */}
      <ScrollRevealFeatures />


      {/* ═══════════════ PROBLEM & SOLUTION ═══════════════ */}
      <ProblemSolution />

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <HowItWorks />

      {/* ═══════════════ MOCKUP SHOWCASE ═══════════════ */}
      <MockupImages />
      <TextReveal />
      <HorizontalGallery />
      <FAQTestimonials />

      {/* ═══════════════ TRUST ═══════════════ */}
      <section id="trust" className="relative overflow-hidden bg-night py-24 md:py-32 text-moonlight">
        {/* Decorative background effects */}
        <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-golden/[0.03] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-amber-glow/[0.02] blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-balance">
              Privacy isn&apos;t a feature.
              <br /><span className="text-golden italic">It&apos;s the foundation.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-moonlight/40 leading-relaxed">
              Every design decision we make starts with your data sovereignty.
              We use the same standards as global financial institutions.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-12 rounded-full bg-golden px-8 py-4 text-sm font-semibold text-night transition-all hover:shadow-moon hover:scale-105 active:scale-95"
            >
              Create your free passport
            </Link>
          </div>
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
        <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-16 pb-10">
          <div className="grid gap-8 md:gap-12 md:grid-cols-[0.7fr_1.3fr]">
            {/* Brand column */}
            <div className="space-y-5">
              <Logo variant="light" />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/70">
                A secure medical passport that gives emergency responders the right
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
                    <a href="#why" className="transition-colors hover:text-golden">
                      Why Lunas
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
          <div className="rounded-2xl border border-border/50 bg-white px-6 py-8 md:px-8 md:py-6 shadow-soft">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4 md:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-golden/10">
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
          <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-border bg-ivory px-4 py-2.5 text-sm text-night placeholder-muted-foreground/50 outline-none transition-colors focus:border-golden/30 focus:ring-1 focus:ring-golden/20"
                    suppressHydrationWarning
                  />
                </div>
                <button className="inline-flex shrink-0 items-center justify-center h-11 gap-2 rounded-xl bg-night px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow active:scale-95 md:px-5" suppressHydrationWarning>
                  <span className="hidden sm:inline">Subscribe</span>
                  <span className="sm:hidden">Send</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ── Bottom bar ── */}
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row text-center md:text-left">
            <div className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Lunas · Team Otso-Otso · A SIKAPTala
              Ideathon project
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
