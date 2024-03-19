/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,tsx,}"],
  theme: {
    extend: {
      backgroundColor: {
        header: "#F3F3F3",
        header_dark: "#2b3041",
        main_dark: "#262b3c",
        cell_default: "#daddde",
        cell_dark: "#3c4150",
        cell_false: "#939B9F",
        cell_true: "#66A060",
        cell_false_position: "#CEB02C",
        cell_dark_false_position: "#CEB02C",
        cell_dark_true: "#6AAA64",
        cell_dark_false: "#939B9F",
        key_light: "#D3D6DA",
        key_dark: "#565F7E",
        key_dark_false: "#4C5255",
        message: "#787c7e",
      },
      textColor: {
        key_light: "#56575E",
      },
    },
  },
  variants: {
    extends: {
      backgroundImage: ["dark"],
    },
  },
  plugins: [],
};
