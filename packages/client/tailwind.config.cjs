/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: "CraftPix, monospace",
      },
      aria: {
        busy: 'busy="true"',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
