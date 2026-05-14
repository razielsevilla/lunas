"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Logo } from "@/components/Logo";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const animElements = headerRef.current?.querySelectorAll(".header-anim");

      if (animElements && animElements.length > 0) {
        tl.fromTo(
          animElements,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div className="header-anim opacity-0">
        <Logo variant="light" />
      </div>
      <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
        <a
          href="#features"
          className="header-anim opacity-0 transition-colors hover:text-foreground"
        >
          Features
        </a>
        <a
          href="#why"
          className="header-anim opacity-0 transition-colors hover:text-foreground"
        >
          Why Lunas
        </a>
        <a href="#how" className="header-anim opacity-0 transition-colors hover:text-foreground">
          How it Works
        </a>
        <a href="#trust" className="header-anim opacity-0 transition-colors hover:text-foreground">
          Trust &amp; Security
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="header-anim opacity-0 text-sm font-medium text-foreground transition-colors hover:text-golden"
        >
          Log in
        </Link>
        <div className="header-anim opacity-0">
          <Link
            href="/register"
            className="rounded-full bg-night px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-glow"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
