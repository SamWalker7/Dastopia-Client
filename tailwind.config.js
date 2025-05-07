/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0d1b3e",
        navy: {
          900: "#000033",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      transform: ["hover", "focus"],
    },
  },
  plugins: [],
};
