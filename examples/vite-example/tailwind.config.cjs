const { typewindTransforms } = require('typewind/transform');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    transform: typewindTransforms,
  },
  theme: {
    extend: {
      colors: {
        primary: '#1FA5E9',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
