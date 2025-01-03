/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#047857',
        accent: '#DC2626',
      }
    },
  },
  plugins: [],
}
