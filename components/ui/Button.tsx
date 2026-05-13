"use client";

import * as React from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-[#1a1c1e] text-white hover:bg-[#2b2e31] shadow-[0_18px_40px_rgba(26,28,30,0.12)]',
  secondary: 'bg-[#f3eee5] text-[#1a1c1e] hover:bg-[#ebe4d7]',
  outline: 'border border-neutral-200 bg-white text-[#1a1c1e] hover:bg-[#fbf8f2]',
  ghost: 'bg-transparent text-[#1a1c1e] hover:bg-[#f3eee5]',
  destructive: 'bg-[#c63d34] text-white hover:bg-[#a8342c]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-sm',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
});
