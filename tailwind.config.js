/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        walnut: {
          50: '#faf6f1',
          100: '#f4ede1',
          200: '#e7d8bf',
          300: '#d7be99',
          400: '#c6a172',
          500: '#b48651',
          600: '#9b6e41',
          700: '#7c5435',
          800: '#5f412d',
          900: '#432e22',
          950: '#2b1c15',
        },
        cinnabar: {
          500: '#c23531',
          600: '#a62420',
          700: '#8a1b18',
        },
        jade: {
          50: '#f0fdf4',
          500: '#15803d',
          600: '#166534',
          700: '#14532d',
        },
        tea: {
          50: '#fcfaf6',
          100: '#f6f1e8',
          200: '#ece1cf',
          300: '#ddc9ad',
          400: '#cbb08c',
          800: '#483c2e',
          900: '#2c241b',
        }
      },
      boxShadow: {
        'antique': '0 4px 20px -2px rgba(67, 46, 34, 0.25)',
        'inner-antique': 'inset 0 2px 8px 0 rgba(43, 28, 21, 0.2)',
      }
    },
  },
  plugins: [],
}
