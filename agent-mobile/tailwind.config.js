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
      colors: {
        brand: {
          DEFAULT: "#1877F2",
          50: "rgba(24,119,242,0.05)",
          100: "rgba(24,119,242,0.1)",
          200: "rgba(24,119,242,0.2)",
          300: "rgba(24,119,242,0.3)",
          400: "rgba(24,119,242,0.4)",
          500: "rgba(24,119,242,0.5)",
          600: "rgba(24,119,242,0.6)",
          700: "rgba(24,119,242,0.7)",
          800: "rgba(24,119,242,0.8)",
          900: "rgba(24,119,242,0.9)",
        },
        status: {
          pending: "#FFFFFF",
          ongoing: "#FFFFFF",
          success: "#FFFFFF",
          cancelled: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
