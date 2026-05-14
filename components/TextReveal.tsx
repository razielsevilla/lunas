"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const textWords = [
  { text: "Your" },
  { text: "medical" },
  { text: "passport," },
  { text: "reimagined.", highlight: true },
  { text: "Offline" },
  { text: "access" },
  { text: "and" },
  { text: "bank-grade", highlight: true },
  { text: "privacy,", highlight: true },
  { text: "ensuring" },
  { text: "your" },
  { text: "data" },
  { text: "is" },
  { text: "always", highlight: true },
  { text: "with", highlight: true },
  { text: "you.", highlight: true },
];

export function TextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;

      const words = textRef.current.querySelectorAll(".reveal-word");

      gsap.to(words, {
        color: (index, target) => {
          return target.dataset.highlight === "true" ? "#C49A6C" : "#0a0a0a"; // golden or night
        },
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 70%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-ivory px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <p
          ref={textRef}
          className="text-4xl font-display font-bold tracking-tighter leading-tight md:text-6xl lg:text-7xl"
        >
          {textWords.map((item, i) => (
            <span
              key={i}
              className={`reveal-word inline-block mr-2 md:mr-4 transition-colors duration-150 ${item.highlight ? "italic" : ""
                }`}
              style={{ color: "rgba(10, 10, 10, 0.15)" }} // Initial light gray color
              data-highlight={item.highlight ? "true" : "false"}
            >
              {item.text}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
