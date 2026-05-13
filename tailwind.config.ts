import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── Premium Healthcare Palette ── */
      colors: {
        ivory:              '#F9F5EB',
        'ivory-warm':       '#F4EDE0',
        night:              '#0B1120',
        'night-light':      '#131D35',
        moonlight:          '#E8E6E1',
        'amber-glow':       '#C8956C',
        'amber-warm':       '#D4A44E',
        golden:             '#C49A6C',
        sage:               '#6B9080',
        destructive:        '#B54A4A',
        cream:              '#F8E4CF',

        primary: {
          DEFAULT:    '#C49A6C',
          foreground: '#0B1120',
        },
        foreground:         '#0B1120',
        'muted-foreground': '#7A7468',
        border:             '#E2DDD4',
        card: {
          DEFAULT:    '#FFFFFF',
          foreground: '#0B1120',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow:     '0 8px 40px rgba(196,154,108,0.18), 0 2px 12px rgba(196,154,108,0.10)',
        moon:     '0 8px 50px rgba(212,164,78,0.22), 0 2px 16px rgba(212,164,78,0.12)',
        soft:     '0 4px 40px rgba(11,17,32,0.06), 0 1px 8px rgba(11,17,32,0.04)',
        'soft-lg':'0 8px 60px rgba(11,17,32,0.08), 0 2px 16px rgba(11,17,32,0.04)',
        glass:    '0 0 20px rgba(255,255,255,0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;