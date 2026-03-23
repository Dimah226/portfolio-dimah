/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        body:    ["'Jost'", 'system-ui', 'sans-serif'],
        mono:    ["'DM Mono'", 'monospace'],
      },
      colors: {
        cream:        'rgb(var(--cream) / <alpha-value>)',
        'cream-dark': 'rgb(var(--cream-dark) / <alpha-value>)',
        ink:          'rgb(var(--ink) / <alpha-value>)',
        'ink-soft':   'rgb(var(--ink-soft) / <alpha-value>)',
        rouge:        'rgb(var(--rouge) / <alpha-value>)',
        'rouge-hover':'rgb(var(--rouge-hover) / <alpha-value>)',
        parchment:    'rgb(var(--parchment) / <alpha-value>)',
        /* alias système */
        primary:      'rgb(var(--cream) / <alpha-value>)',
        foreground:   'rgb(var(--ink) / <alpha-value>)',
        accent:       'rgb(var(--rouge) / <alpha-value>)',
        'accent-hover':'rgb(var(--rouge-hover) / <alpha-value>)',
        surface:      'rgb(var(--cream-dark) / <alpha-value>)',
      },
      borderRadius: {
        sm: '0px', md: '2px', lg: '2px', xl: '2px',
      },
      keyframes: {
        'cursor-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.7s ease forwards',
        marquee:      'marquee 18s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addBase }) => {
      addBase({ ':root': { '--radius': '0.125rem' } });
    }),
  ],
};
