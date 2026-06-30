/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#404040',
          dark: '#262626',
          light: '#f5f5f5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          variant: '#F5F5F5',
          dark: '#171717',
          'dark-variant': '#262626',
        },
        ink: {
          DEFAULT: '#171717',
          secondary: '#525252',
          tertiary: '#a3a3a3',
        },
        border: {
          DEFAULT: '#E5E5E5',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
        },
        status: {
          pending: '#D97706',
          approved: '#2563EB',
          processing: '#7C3AED',
          ready: '#0891B2',
          completed: '#16A34A',
          cancelled: '#DC2626',
        },
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
