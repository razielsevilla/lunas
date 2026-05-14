"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const images = [
  "/images/mockup-images (6).png",
  "/images/mockup-images (7).png",
  "/images/mockup-images (8).png",
  "/images/mockup-images (9).png",
  "/images/mockup-images (10).png"
];

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!galleryRef.current || !containerRef.current) return;
      
      // Calculate how far to move to the left
      // We want to stop when the right edge of the gallery aligns with the right edge of the screen
      // Add a little padding to the end so it doesn't abruptly stop.
      const getScrollAmount = () => {
        const galleryWidth = galleryRef.current?.scrollWidth || 0;
        return -(galleryWidth - window.innerWidth + 80); // 80 is roughly the padding
      };

      const tween = gsap.to(galleryRef.current, {
        x: getScrollAmount,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 0.5,
        invalidateOnRefresh: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">
      <section ref={containerRef} className="relative bg-ivory h-screen overflow-hidden">
        <div className="flex h-full items-center">
        <div ref={galleryRef} className="flex gap-6 px-6 md:px-12 lg:px-20 will-change-transform w-max">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-[60vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw] shadow-soft bg-night/5 border border-border/50"
            >
              <Image
                src={src}
                alt={`Lunas Mockup Gallery ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      </section>
    </div>
  );
}
