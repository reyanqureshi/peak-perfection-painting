/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          dark:    '#06101e',
          deep:    '#0c1829',
          card:    '#0e1f35',
        },
        gold: {
          DEFAULT: '#D4A017',
          light:   '#e8c040',
          dark:    '#b8880f',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body:    ['Sora', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee':     'marquee 38s linear infinite',
        'marquee-rev': 'marqueeRev 38s linear infinite',
        'fade-up':     'fadeUp 0.65s ease-out forwards',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRev: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
