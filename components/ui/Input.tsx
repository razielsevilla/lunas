"use client";

import * as React from 'react';

import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-11 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-[#1a1c1e] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#c8c0b2] focus:ring-2 focus:ring-[#1a1c1e]/5',
        className,
      )}
      {...props}
    />
  );
});
