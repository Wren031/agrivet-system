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
          DEFAULT: "#404040",
          50: "rgba(64,64,64,0.05)",
          100: "rgba(64,64,64,0.1)",
          200: "rgba(64,64,64,0.2)",
          300: "rgba(64,64,64,0.3)",
          400: "rgba(64,64,64,0.4)",
          500: "rgba(64,64,64,0.5)",
          600: "rgba(64,64,64,0.6)",
          700: "rgba(64,64,64,0.7)",
          800: "rgba(64,64,64,0.8)",
          900: "rgba(64,64,64,0.9)",
        },
        accent: {
          DEFAULT: "#a3a3a3",
          50: "rgba(163,163,163,0.05)",
          100: "rgba(163,163,163,0.1)",
          200: "rgba(163,163,163,0.2)",
          300: "rgba(163,163,163,0.3)",
          400: "rgba(163,163,163,0.4)",
          500: "rgba(163,163,163,0.5)",
          600: "rgba(163,163,163,0.6)",
          700: "rgba(163,163,163,0.7)",
          800: "rgba(163,163,163,0.8)",
          900: "rgba(163,163,163,0.9)",
        },
        status: {
          pending: "#d97706",
          ongoing: "#7c3aed",
          success: "#16a34a",
          cancelled: "#a3a3a3",
        },
        surface: {
          light: "#fafafa",
          dark: "#171717",
        },
      },
    },
  },
  plugins: [],
};
