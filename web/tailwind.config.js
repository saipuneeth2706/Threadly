/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-dark': '#1E1E1E',
        'gray-medium': '#2D2D2D',
        'gray-light': '#3C3C3C',
        'gray-very-light': '#4B4B4B',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
