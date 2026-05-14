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

      // Animate left and right columns to expand while fading in
      tl.to(
        leftColRef.current,
        { width: "33.333%", x: "0%", opacity: 1, duration: 1, ease: "none" },
        0
      )
        .to(
          rightColRef.current,
          { width: "33.333%", x: "0%", opacity: 1, duration: 1, ease: "none" },
          0
        )
        // Fade and blur out the text overlay
        .to(
          centerTextRef.current,
          { opacity: 0, filter: "blur(10px)", duration: 0.8, ease: "none" },
          0.1
        )
        // Fade out the dark overlay on the center image so it becomes bright
        .to(
          bgOverlayRef.current,
          { opacity: 0, duration: 0.8, ease: "none" },
          0.1
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
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (3).png"
                  alt="Lunas QR Code scanning interface"
                  fill
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
                <h2 className="max-w-4xl font-display leading-[1.05] tracking-tighter text-white text-5xl md:text-7xl lg:text-[5.5rem]">
                  <span className="block mb-3 drop-shadow-lg">Security</span>
                  <span className="block mb-3 italic text-golden drop-shadow-lg">meets</span>
                  <span className="block drop-shadow-lg">fashion.</span>
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
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="/images/mockup-images (5).png"
                  alt="Lunas emergency profile"
                  fill
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
