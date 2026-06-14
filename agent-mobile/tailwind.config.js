/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        xs: ["13px", { lineHeight: "18px" }],
        sm: ["15px", { lineHeight: "22px" }],
        base: ["17px", { lineHeight: "24px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["22px", { lineHeight: "30px" }],
        "2xl": ["26px", { lineHeight: "34px" }],
        "3xl": ["32px", { lineHeight: "40px" }],
      },
      colors: {
        brand: {
          DEFAULT: "#1b4332",
          50: "rgba(27,67,50,0.05)",
          100: "rgba(27,67,50,0.1)",
          200: "rgba(27,67,50,0.2)",
          300: "rgba(27,67,50,0.3)",
          400: "rgba(27,67,50,0.4)",
          500: "rgba(27,67,50,0.5)",
          600: "rgba(27,67,50,0.6)",
          700: "rgba(27,67,50,0.7)",
          800: "rgba(27,67,50,0.8)",
          900: "rgba(27,67,50,0.9)",
        },
        accent: {
          DEFAULT: "#d4a373",
          50: "rgba(212,163,115,0.05)",
          100: "rgba(212,163,115,0.1)",
          200: "rgba(212,163,115,0.2)",
          300: "rgba(212,163,115,0.3)",
          400: "rgba(212,163,115,0.4)",
          500: "rgba(212,163,115,0.5)",
          600: "rgba(212,163,115,0.6)",
          700: "rgba(212,163,115,0.7)",
          800: "rgba(212,163,115,0.8)",
          900: "rgba(212,163,115,0.9)",
        },
        status: {
          pending: "#d4a373",
          ongoing: "#2d6a4f",
          success: "#1b4332",
          cancelled: "#6c757d",
        },
        surface: {
          light: "#f4f7f5",
          dark: "#1e293b",
        },
      },
    },
  },
  plugins: [],
};
