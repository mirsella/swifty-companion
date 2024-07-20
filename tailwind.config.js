const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    iconsPlugin({
      collections: getIconCollections(["carbon"]),
    }),
  ],
};
