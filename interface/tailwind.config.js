/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  "./public/index.html",
  "./public/test.html",
  './pages/**/*.{html,js}',
  './components/**/*.{html,js}',"./src/*.html"],

  theme: {
    extend: {},
  },
  plugins: [],
};
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'black': '#000000',
      'indigo':'#1f1f4e',
      'gray':'#94A3B8',
      'purple': '#3f1466',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'card':'#3f1466',
      'primary':'#3f1466',
      'buttonhover':'#3f1466',
      'buttonpressed':'#999CF9',
    },
  },
}
const plugin = require("tailwindcss/plugin");

const Myclass = plugin(function ({ addUtilities }) {
  addUtilities({
    ".my-rotate-y-180": {
      transform: "rotateY(180deg)",
    },
    ".preserve-3d": {
      transformStyle: "preserve-3d",
    },
    ".perspective": {
      perspective: "1000px",
    },
    ".backface-hidden": {
      backfaceVisibility: "hidden",
    },
  });
});
