import React from 'react';

export const Logo = ({ className = "", variant = "light" }: { className?: string; variant?: "dark" | "light" }) => {
  const textColor = variant === "dark" ? "text-moonlight" : "text-night";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-golden text-ivory shadow-glow">
        <svg viewBox="0 0 36 36" fill="none" className="h-7 w-7">
          {/* Crescent moon arc */}
          <path
            d="M18 3C9.72 3 3 9.72 3 18c0 3.8 1.4 7.3 3.8 9.9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Medical cross */}
          <rect x="14" y="8" width="8" height="20" rx="2" fill="currentColor" />
          <rect x="8" y="14" width="20" height="8" rx="2" fill="currentColor" />
          {/* Heart cutout */}
          <path
            d="M18 22.5l-2.8-2.8c-1-1-1.2-1.7-1.2-2.4a1.7 1.7 0 0 1 1.7-1.6c.6 0 1 .3 1.4.7l.9.9.9-.9c.4-.4.8-.7 1.4-.7a1.7 1.7 0 0 1 1.7 1.6c0 .7-.2 1.4-1.2 2.4L18 22.5z"
            fill="#C49A6C"
          />
          {/* Sparkle dots */}
          <circle cx="30" cy="8" r="1.6" fill="currentColor" />
          <circle cx="33" cy="14" r="1" fill="currentColor" />
          <circle cx="29" cy="19" r="0.7" fill="currentColor" />
        </svg>
      </div>
      <span className={`font-display text-xl font-semibold tracking-tight ${textColor}`}>
        Lunas
      </span>
    </div>
  );
};
