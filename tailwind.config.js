/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#0a192f',
          50: '#e8edf5',
          100: '#c5d0e0',
          200: '#a0b1cb',
          300: '#7b91b5',
          400: '#5e789f',
          500: '#3f5d89',
          600: '#324a6e',
          700: '#1a2d50',
          800: '#112240',
          900: '#0a192f',
        },
        gold: {
          DEFAULT: '#c9a24c',
          50: '#fbf3e0',
          100: '#f6e4b8',
          200: '#ecc97a',
          300: '#e0b35e',
          400: '#d4af5e',
          500: '#c9a24c',
          600: '#a8862e',
          700: '#7a611f',
        },
        royal: {
          DEFAULT: '#7c3aed',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
        },
        border: '#e2e8f0',
        'surface-alt': '#f8fafc',
      },
      gridTemplateColumns: {
        25: 'repeat(25, minmax(0, 1fr))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(10, 25, 47, 0.08)',
        'card': '0 4px 16px -4px rgba(10, 25, 47, 0.1)',
        'lift': '0 8px 24px -8px rgba(10, 25, 47, 0.15)',
        'glow-gold': '0 0 24px -4px rgba(201, 162, 76, 0.4)',
        'glow-navy': '0 0 24px -4px rgba(10, 25, 47, 0.3)',
      },
    },
  },
  plugins: [],
};
