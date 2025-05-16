/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'happy-blue': '#3b82f6',
        'happy-green': '#10b981',
        'happy-yellow': '#f59e0b',
        'happy-red': '#ef4444',
      },
    },
  },
  plugins: [],
} 
