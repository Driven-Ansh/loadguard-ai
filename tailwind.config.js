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
        industrial: {
          950: '#050811',
          900: '#090e1a',
          850: '#0d1527',
          800: '#121d36',
          750: '#182749',
          700: '#1e315b',
          600: '#2a437a',
          500: '#3b5fa9',
          400: '#6085d8',
        },
        electric: {
          cyan: '#00f0ff',
          blue: '#00a8ff',
          dim: 'rgba(0, 240, 255, 0.15)',
        },
        status: {
          green: '#00e676',
          amber: '#ffb300',
          red: '#ff1744',
          dimGreen: 'rgba(0, 230, 118, 0.15)',
          dimAmber: 'rgba(255, 179, 0, 0.15)',
          dimRed: 'rgba(255, 23, 68, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-green': '0 0 20px -3px rgba(0, 230, 118, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(255, 179, 0, 0.35)',
        'glow-red': '0 0 25px -2px rgba(255, 23, 68, 0.45)',
      }
    },
  },
  plugins: [],
}

