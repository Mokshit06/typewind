const { typewindTransforms } = require('typewind/transform');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './theme.config.tsx',
      './styles.css',
    ],
    transform: typewindTransforms,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
