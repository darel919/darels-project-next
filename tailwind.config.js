/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        light: {
          primary: '#ffffff',
          secondary: '#f3f4f6',
          accent: '#3b82f6',
          text: '#1f2937',
          'text-secondary': '#4b5563'
        },
        dark: {
          primary: '#1f2937',
          secondary: '#111827',
          accent: '#60a5fa',
          text: '#f9fafb',
          'text-secondary': '#d1d5db'
        }
      },
      backgroundColor: {
        'background': 'rgb(var(--background-start-rgb))'
      }
    },
  },
  plugins: [],
};