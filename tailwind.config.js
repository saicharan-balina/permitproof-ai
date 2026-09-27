/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090e',
          900: '#0d1117',
          850: '#131822',
          800: '#171e2c',
          750: '#1d2638',
          700: '#232e43',
        },
        brand: {
          50: '#eef2ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          950: '#2c0b0e',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
