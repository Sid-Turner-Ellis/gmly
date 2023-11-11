/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";

// Typescript asChild - https://www.radix-ui.com/primitives/docs/guides/styling#extending-a-primitive

// TODO: Create a script to get the correct node_modules path (find the closest node_modules folder with flowbite)

module.exports = {
  darkMode: ["class"],
  mode: "jit",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        p: defaultTheme.fontSize.xl,
      },
      borderRadius: {
        DEFAULT: defaultTheme.borderRadius.lg,
      },
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        banner: 1030,
        overlay: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
      },

      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionProperty: {},

      colors: {
        brand: {
          primary: {
            DEFAULT: "var(--brand-color-primary)",
            dark: "var(--brand-color-primary-dark)",
          },
          white: {
            DEFAULT: "var(--brand-color-white)",
          },
          gray: {
            DEFAULT: "var(--brand-color-gray)",
          },

          navy: {
            DEFAULT: "var(--brand-color-navy)",
            "accent-dark": "var(--brand-color-navy-accent-dark)",
            "accent-light": "var(--brand-color-navy-accent-light)",

            light: {
              DEFAULT: "var(--brand-color-navy-light)",
              "accent-light": "var(--brand-color-navy-light-accent-light)",
            },
          },
          status: {
            success: {
              DEFAULT: "var(--brand-color-success)",
              light: "var(--brand-color-success-light)",
            },
            error: {
              DEFAULT: "var(--brand-color-error)",
              light: "var(--brand-color-error-light)",
            },
            warning: {
              DEFAULT: "var(--brand-color-warning)",
              light: "var(--brand-color-warning-light)",
            },
          },
        },
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
      },

      // Animations
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },

      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("autoprefixer"),
    require("tailwindcss"),
  ],
};
