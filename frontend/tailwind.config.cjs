/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        custome: { max: "1632px" },
      },
      colors: {
        logo: {
          50: "#482B65",
        },
        mypalette: {
          1: "#00b4d8",
          2: "#0077b6",
          3: "#03045e",
          4: "#ff9f1c",
          5: "#ffbf69",
        },
      },
    },
  },
  plugins: [],
}
