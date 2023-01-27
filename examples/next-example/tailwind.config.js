const { typewindTransforms } = require('typewind/transform');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',

      // Or if using `src` directory:
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    transform: typewindTransforms,
  },
  theme: {
    extend: {
      colors: {
        'next-example-primary': '#1FA5E9',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
