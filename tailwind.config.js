/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/(admin)/**/*.{js,jsx}", "./components/admin/**/*.{js,jsx}"],
  corePlugins: { preflight: false }, // never touch the public site's own CSS
  important: ".gk-admin", // scope every utility to inside the admin shell
  theme: {
    extend: {
      colors: {
        ink: "#15151a",
        paper: "#fafaf9",
        line: "#e6e4df",
        accent: "#b08d57",
        danger: "#b3311f",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
