/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    fontFamily: {
      "space-grotesk": ["Space Grotesk"],
    },
    extend: {
      width: {
        128: "32rem",
      },
      colors: {
        "light-sand": "#FCF7E6",
        "dark-grey": "#1E1E1E",
      },
      maxHeight: {
        72: "72px",
        2000: "2000px",
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
