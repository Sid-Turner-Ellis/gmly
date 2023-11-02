/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

// TODO: Create a script to get the correct node_modules path (find the closest node_modules folder with flowbite)

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: defaultTheme.borderRadius.md,
      },
      colors: {
        whiteAlpha: {
          50: "rgba(255, 255, 255, 0.04)",
          100: "rgba(255, 255, 255, 0.06)",
          200: "rgba(255, 255, 255, 0.08)",
          300: "rgba(255, 255, 255, 0.16)",
          400: "rgba(255, 255, 255, 0.24)",
          500: "rgba(255, 255, 255, 0.36)",
          600: "rgba(255, 255, 255, 0.48)",
          700: "rgba(255, 255, 255, 0.64)",
          800: "rgba(255, 255, 255, 0.80)",
          900: "rgba(255, 255, 255, 0.92)",
        },
        status: {
          error: "#DD364D",
          warning: "#35b0fc",
          success: "#48FFC8",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
        },

        icon: {
          DEFAULT: "var(--color-icon)",
          hover: "var(--color-icon-hover)",
        },

        gray5: "var(--color-gray-5)",
        gray10: "var(--color-gray-10)",
        text: {
          DEFAULT: "var(--color-text)",
          heading: "var(--color-heading)",
        },

        bg: {
          DEFAULT: "var(--color-bg)",
          light: "var(--color-bg-light)",
          dark: "var(--color-bg-dark)",
          purple: "var(--color-bg-purple)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("flowbite/plugin")],
};
