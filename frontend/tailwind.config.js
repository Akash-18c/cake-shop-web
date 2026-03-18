/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f5dba8',
          300: '#efc06e',
          400: '#e8a03c',
          500: '#d4821a',
          600: '#b86612',
          700: '#924d10',
          800: '#773e14',
          900: '#623413',
        },
        surface: '#FDFAF5',
        dark:  '#1C1008',
        muted: '#7A6652',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'warm':    '0 4px 24px 0 rgba(180,100,20,0.10)',
        'warm-lg': '0 8px 40px 0 rgba(180,100,20,0.18)',
        'card':    '0 2px 16px 0 rgba(28,16,8,0.07)',
        'card-hover': '0 8px 40px 0 rgba(28,16,8,0.13)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1C1008 0%, #3D2010 50%, #6B3A1F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e8a03c 0%, #d4821a 50%, #b86612 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fdf8f0 0%, #faefd9 100%)',
      },
    },
  },
  plugins: [],
}
