/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enables class-based dark mode toggling
  theme: {
    extend: {
      colors: {
        background: {
          light: "#f9fafb",
          dark: "#0f172a", // A good base for dark UIs
        },
        foreground: {
          light: "#1f2937",
          dark: "#f3f4f6",
        },
      },
    },
  },
  plugins: [],
};
