/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F3EEE6",
        ink: "#111111",
        bronze: "#C4A484",
        sand: "#C9A58D",
        rust: "#C15B3E",
        stone: "#6E675F",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};
