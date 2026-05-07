/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#FFF9F0",
        cream: "#FDF8F0",
        card: "#FFFFFF",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Poppins",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.08)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.12)",
      },
      screens: {
        md: "768px",
        lg: "1024px",
      },
    },
  },
  plugins: [],
};
