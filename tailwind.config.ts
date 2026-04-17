import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        regcat: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          hover: '#2a2a2a',
          border: '#3a3a3a',
          text: '#e0e0e0',
          'text-secondary': '#b0b0b0',
          'text-tertiary': '#808080',
          accent: '#00ff99',
          'accent-hover': '#00dd88',
          error: '#ff4444',
          warning: '#ffaa00',
          'callout-tip': '#00ff99',
          'callout-warning': '#ffb700',
          'callout-note': '#66b3ff',
          'callout-info': '#b0b0b0',
        },
      },
      fontFamily: {
        mono: ['"Monaco"', '"Fira Code"', '"Consolas"', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
      },
      animation: {
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        250: '250ms',
      },
      boxShadow: {
        'glow-accent': '0 0 12px rgba(0, 255, 153, 0.15)',
        'glow-accent-lg': '0 0 20px rgba(0, 255, 153, 0.25)',
      },
      borderRadius: {
        'sm': '2px',
      },
    },
  },
  plugins: [],
};

export default config;
