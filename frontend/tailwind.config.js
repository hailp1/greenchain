/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        natural: {
          50: '#fdfcf8',
          100: '#f7f6f0',
          200: '#e9e6d8',
          300: '#d1ccb8',
          400: '#b4ac91',
          500: '#9b9172',
          600: '#84785c',
          700: '#6e634e',
          800: '#5c5243',
          900: '#4d453a',
          950: '#29241e',
        },
      },
    },
  },
  plugins: [],
}
