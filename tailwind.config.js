const withOpacityValue = (variable) => `rgb(var(${variable}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: withOpacityValue('--color-brand-red'),
          dark: withOpacityValue('--color-brand-dark'),
        },
        sustainable: {
          green: withOpacityValue('--color-sustainable-green'),
          dark: withOpacityValue('--color-sustainable-dark'),
        },
        warm: {
          white: withOpacityValue('--color-warm-white'),
          light: withOpacityValue('--color-warm-light'),
        },
        text: {
          primary: withOpacityValue('--color-text-primary'),
          secondary: withOpacityValue('--color-text-secondary'),
        }
      },
      fontFamily: {
        'arizona': ['ABC Arizona Flare', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}