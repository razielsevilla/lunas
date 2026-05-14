import React from 'react';
import Image from 'next/image';

export const Logo = ({ className = "", variant = "light" }: { className?: string; variant?: "dark" | "light" }) => {
  const textColor = variant === "dark" ? "text-moonlight" : "text-night";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
        <Image 
          src="/logo/lunas-logo.png" 
          alt="Lunas Logo" 
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </div>
      <span className={`font-display text-xl font-semibold tracking-tight ${textColor}`}>
        Lunas
      </span>
    </div>
  );
};
