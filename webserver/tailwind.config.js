/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        NunitoSans: ['"Nunito Sans"', "sans-serif"],
        Roboto: ['"Roboto"', "sans-serif"],

      }
    },
  },
  plugins: [],
}

