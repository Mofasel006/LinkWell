/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#f9f6f3',
          200: '#f3ede6',
        },
        ink: {
          400: '#6b7280',
          600: '#4b5563',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
