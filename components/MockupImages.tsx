"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MockupImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning and animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      });

      const revealWords = centerTextRef.current?.querySelectorAll(".reveal-word");

      // 1. Text Reveal Animation (like TextReveal component)
      if (revealWords) {
        tl.to(revealWords, {
          color: (index, target) => {
            return (target as HTMLElement).dataset.highlight === "true" ? "#C49A6C" : "#ffffff";
          },
          stagger: 0.2,
          duration: 0.5,
          ease: "power2.out"
        }, 0);
      }

      // 2. Animate left and right columns to expand while fading in
      tl.to(
        leftColRef.current,
        { width: "33.333%", x: "0%", opacity: 1, duration: 1, ease: "none" },
        0.3
      )
        .to(
          rightColRef.current,
          { width: "33.333%", x: "0%", opacity: 1, duration: 1, ease: "none" },
          0.3
        )
        // 3. Fade and blur out the text overlay after it has revealed
        .to(
          centerTextRef.current,
          { opacity: 0, filter: "blur(20px)", y: -20, duration: 0.8, ease: "power2.inOut" },
          1.2
        )
        // Fade out the dark overlay on the center image
        .to(
          bgOverlayRef.current,
          { opacity: 0, duration: 0.8, ease: "none" },
          1.2
        );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-ivory">
      <div>
        <div
          ref={containerRef}
          className="h-screen w-full overflow-hidden flex items-center justify-center bg-ivory"
        >
          <div className="relative flex h-full w-full items-stretch justify-center gap-4 md:gap-6 p-4 md:p-8">

            {/* LEFT COLUMN */}
            <div
              ref={leftColRef}
              className="flex flex-col gap-4 md:gap-6 will-change-transform opacity-0 z-10"
              style={{ width: "0%", transform: "translateX(-100%)" }}
            >
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (2).png"
                  alt="Lunas app showing vital details"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (3).png"
                  alt="Lunas QR Code scanning interface"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* CENTER COLUMN (Main Hero) */}
            <div className="relative w-full h-full flex-auto overflow-hidden rounded-2xl md:rounded-3xl z-0">
              <Image
                src="/images/mockup-images (1).png"
                alt="Lunas platform overview"
                fill
                sizes="(max-width: 768px) 100vw, 34vw"
                className="object-cover"
                priority
              />
              {/* Dark overlay for text readability */}
              <div
                ref={bgOverlayRef}
                className="absolute inset-0 bg-night/60 transition-opacity"
              />

              {/* Text Overlay */}
              <div
                ref={centerTextRef}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
              >
                <h2 className="max-w-4xl font-display leading-[1.05] tracking-tighter text-5xl md:text-7xl lg:text-[5.5rem]">
                  <span
                    className="reveal-word block mb-3 drop-shadow-lg"
                    style={{ color: "rgba(255, 255, 255, 0.15)" }}
                    data-highlight="false"
                  >
                    Security
                  </span>
                  <span
                    className="reveal-word block mb-3 italic text-golden drop-shadow-lg"
                    style={{ color: "rgba(196, 154, 108, 0.15)" }}
                    data-highlight="true"
                  >
                    meets
                  </span>
                  <span
                    className="reveal-word block drop-shadow-lg"
                    style={{ color: "rgba(255, 255, 255, 0.15)" }}
                    data-highlight="false"
                  >
                    fashion.
                  </span>
                </h2>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div
              ref={rightColRef}
              className="flex flex-col gap-4 md:gap-6 will-change-transform opacity-0 z-10"
              style={{ width: "0%", transform: "translateX(100%)" }}
            >
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (4).png"
                  alt="Lunas dashboard showing allergies"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (5).png"
                  alt="Lunas emergency profile"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
