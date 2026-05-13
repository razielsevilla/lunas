"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    category: "EMERGENCY ACCESS",
    question: "Who can actually scan my Lunas QR code?",
    answer: "Only PRC-verified medical professionals and first responders with our secure portal can decrypt and view your full medical history. Every scan is logged and generates an instant alert to your emergency contacts."
  },
  {
    category: "DATA PRIVACY",
    question: "Is my medical information encrypted?",
    answer: "Yes. We use AES-256 military-grade encryption. Your data is encrypted at rest and in transit, and only accessible via a secure, audited decryption gate. We never sell your data to third parties."
  },
  {
    category: "FUNCTIONALITY",
    question: "Do I need an internet connection for the scan to work?",
    answer: "Your primary QR code carries your UUID which requires a connection to fetch live records. However, we also provide a 'Lite' version of your profile for offline access in low-signal areas."
  },
  {
    category: "ACCOUNT",
    question: "How do I update my medical records after I've printed my card?",
    answer: "Simply log into your Lunas dashboard and update your info. Your printed QR code stays the same — it always points to your most current profile in real-time."
  },
];

const testimonials = [
  {
    text: "Knowing my elderly father has his Lunas card in his wallet gives our entire family peace of mind. It's the most essential 'insurance' we've ever had.",
    author: "Ray Fernando",
    role: "Family Caregiver",
  },
];

export function FAQTestimonials() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current.querySelectorAll(".reveal-item"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
            clearProps: "all",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ivory py-32 text-night">
      {/* Decorative background effects matching the light theme */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-golden/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-amber-glow/[0.05] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Top Header Row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="reveal-item max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tighter md:text-6xl text-balance">
              Answers to your most <br />
              <span className="text-golden italic">common questions</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-balance">
              Everything you need to know to get started, manage your account, and get support quickly.
            </p>
          </div>
          <Link href="/contact" className="reveal-item">
            <button className="rounded-full border border-border bg-white px-8 py-3 text-sm font-semibold text-night transition-all hover:border-golden/40 hover:shadow-soft text-nowrap">
              Contact support
            </button>
          </Link>
        </div>

        <div className="grid gap-20 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Left Column - FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => toggleFAQ(index)}
                className={`reveal-item group cursor-pointer rounded-3xl border border-border p-8 transition-all duration-300 ${openIndex === index ? "bg-white border-golden/30 shadow-soft" : "bg-transparent hover:border-golden/50"
                  }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors group-hover:text-golden">
                  {faq.category}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <h3 className={`text-xl font-medium tracking-tight transition-colors ${openIndex === index ? "text-night" : "text-night/80 group-hover:text-night"
                    }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-night/50 transition-all duration-500 ${openIndex === index ? "rotate-45 border-golden bg-golden/5 text-golden" : "group-hover:border-golden/40 group-hover:text-golden"
                    }`}>
                    <Plus size={18} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Answer reveal with smooth height transition */}
                <div className={`grid transition-all duration-500 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Testimonials */}
          <div className="space-y-12">
            <div className="reveal-item space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-white px-4 py-1.5 shadow-soft">
                <div className="h-1.5 w-1.5 rounded-full bg-golden shadow-glow-sm" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Testimonials</span>
              </div>

              <h2 className="font-display text-4xl font-bold tracking-tighter md:text-5xl text-balance text-night">
                Loved by builders, <br />
                <span className="text-muted-foreground/40 italic">easy turnarounds</span>
              </h2>
              <p className="text-lg text-muted-foreground/60 leading-relaxed text-balance">
                Real results from real teams — faster reviews, cleaner handoff, and a smoother path from idea to shipped UI.
              </p>
            </div>

            <div className="space-y-6">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="reveal-item relative overflow-hidden rounded-[2rem] border border-border/50 bg-white p-8 transition-all duration-500 hover:border-golden/20 hover:shadow-soft-lg group"
                >
                  <Quote className="h-6 w-6 text-golden/30 transition-colors group-hover:text-golden/50" strokeWidth={1.5} />
                  <p className="mt-6 text-lg leading-relaxed text-night/80">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-night">{t.author}</div>
                      <div className="text-sm text-muted-foreground/60">{t.role}</div>
                    </div>
                    {/* Placeholder for removed profile image - subtle accent */}
                    <div className="h-1 w-8 rounded-full bg-golden/20 transition-all group-hover:w-12 group-hover:bg-golden/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
