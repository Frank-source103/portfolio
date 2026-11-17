/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      colors: {
        steel: {
          950: '#0C0E12',
          900: '#12151B',
          850: '#171B22',
          800: '#20252F',
          700: '#2E3543',
        },
        ochre: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      }
    },
  },
  plugins: [],
}
