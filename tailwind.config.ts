/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#000000',
          deep:     '#090909',
          graphite: '#111111',
          amber:    '#FF8A00',
          white:    '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      animation: {
        'fade-in':   'fadeIn 1.2s ease forwards',
        'slide-up':  'slideUp 0.8s ease forwards',
        'blink':     'blink 2s ease-in-out infinite',
        'particle':  'particle 8s ease-in-out infinite',
        'scan':      'scan 3s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        blink:    { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '1' } },
        particle: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        scan:     { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
      },
      backdropBlur: {
        xs: '2px',
        brand: '12px',
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'expo':  'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
