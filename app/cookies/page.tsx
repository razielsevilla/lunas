"use client";

/**
 * Cookie Policy — Lunas
 * Redesigned to match the Problem & Solution aesthetic.
 */

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Settings, 
  Database,
  MapPin,
  Cookie
} from "lucide-react";

export default function CookiePolicyPage() {
  const sections = [
    {
      icon: Cookie,
      title: "Essential Cookies",
      description: "These are strictly necessary for the website to function. They enable core features like security, network management, and accessibility.",
    },
    {
      icon: Database,
      title: "Performance Tracking",
      description: "We use these to understand how visitors interact with our site, helping us discover which pages are most and least popular.",
    },
    {
      icon: Settings,
      title: "User Preferences",
      description: "These allow our website to remember choices you make (such as your region) to provide a more personalized experience.",
    },
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

      {/* MAIN HERO SECTION (Split Aesthetic) */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-48 pt-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          
          {/* Left Column - High Impact Title */}
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tighter text-night md:text-6xl lg:text-7xl">
                Transparency <br />
                <span className="text-golden italic">by design.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground/80">
                We use cookies to improve your experience and ensure our platform remains secure. 
                Learn how we handle your digital footprint.
              </p>
            </div>

            {/* Quick Pillars */}
            <div className="space-y-6">
              {sections.map((s, idx) => (
                <div key={idx} className="group relative flex items-start gap-5 rounded-2xl border border-golden/10 bg-white/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-golden/30 hover:bg-white hover:shadow-soft-xl">
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
              ))}
            </div>
          </div>

          {/* Right Column - Detailed Policy */}
          <div className="rounded-[2.5rem] border border-night/[0.03] bg-white/60 p-8 shadow-soft-2xl backdrop-blur-md md:p-12 lg:p-16">
            <div className="max-w-none space-y-12 text-muted-foreground/90">
              <div className="space-y-2 border-b border-night/5 pb-8">
                <h2 className="font-display text-3xl font-bold text-night">Cookie Policy</h2>
                <p className="text-sm font-medium uppercase tracking-widest text-golden/60">Last Updated: May 14, 2026</p>
              </div>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-night/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-night/20">01</span>
                </div>
                <h3 className="text-xl font-bold text-night">What are cookies?</h3>
                <p className="leading-relaxed text-sm lg:text-base">
                  Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-night/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-night/20">02</span>
                </div>
                <h3 className="text-xl font-bold text-night">How we use them</h3>
                <p className="leading-relaxed text-sm lg:text-base">
                  We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                </p>
                <div className="rounded-xl border border-golden/20 bg-golden/[0.03] p-4 text-sm italic text-golden/80">
                  "Our cookies do not store any sensitive medical information. Your health data is always kept separate and secure."
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-night/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-night/20">03</span>
                </div>
                <h3 className="text-xl font-bold text-night">Managing Cookies</h3>
                <p className="leading-relaxed text-sm lg:text-base">
                  You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. 
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-night/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-night/20">04</span>
                </div>
                <h3 className="text-xl font-bold text-night">Updates to this policy</h3>
                <p className="leading-relaxed text-sm lg:text-base">
                  We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed.
                </p>
              </section>

            </div>
          </div>

        </div>
      </main>

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
                    <Link href="/cookies" className="transition-colors hover:text-golden text-golden font-medium">
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

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
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
