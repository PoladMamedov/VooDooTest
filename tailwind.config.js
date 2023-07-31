/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    fontFamily: {
      "space-grotesk": ["Space Grotesk"],
    },
    extend: {
      colors: {
        "light-sand": "#FCF7E6",
      },
    },
    container: {
      screens: {
        sm: "400px",
        md: "528px",
        lg: "784px",
        xl: "1040px",
        "2xl": "1296px",
      },
    },
  },
  plugins: [],
};
