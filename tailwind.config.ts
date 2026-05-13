import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './docs/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        aurora: '#1f7a8c',
        ember: '#e76f51',
        'navy-deep': '#1a2744',
        'gold-accent': '#d4af37',
        'cream-soft': '#faf7f2',
        'blue-grey': '#e8eef5',
        'banner-green': '#d4edda',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(31, 122, 140, 0.15), 0 20px 60px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;