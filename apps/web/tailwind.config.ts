import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// Typescript asChild - https://www.radix-ui.com/primitives/docs/guides/styling#extending-a-primitive

// TODO: Create a script to get the correct node_modules path (find the closest node_modules folder with flowbite)

export default {
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
      screens: {
        xs: "460px",
      },

      fontFamily: {
        grotesque: "var(--font-grotesque)",
        inter: "var(--font-inter)",
      },

      borderRadius: {
        DEFAULT: defaultTheme.borderRadius.lg,
      },

      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        banner: "1030",
        overlay: "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },

      transitionDuration: {
        DEFAULT: "150ms",
      },
      transitionProperty: {},

      colors: {
        brand: {
          primary: {
            DEFAULT: "#6c48ff",
            dark: "#593ada",
          },
          white: {
            DEFAULT: "#ebebeb",
          },
          gray: {
            DEFAULT: "#939597",
            dark: "#787878",
          },

          red: {
            DEFAULT: "#DD364D",
            dark: "#BA263A",
          },

          navy: {
            DEFAULT: "#1a1c20",
            "accent-dark": "#08090a",
            "accent-light": "#33373e",

            light: {
              DEFAULT: "#272a30",
              "accent-light": "#3d414b",
            },

            dark: {
              DEFAULT: "#23252B",
            },
          },
          status: {
            success: {
              DEFAULT: "#48ffc8",
              light: "#234942",
            },
            error: {
              DEFAULT: "#dd364d",
              light: "#412129",
            },
            warning: {
              DEFAULT: "#dd7c36",
              light: "#412f24",
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
      // TODO: Most of these are for specific components so make sure to name them accor
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
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

        collapsableSlideDown: {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-collapsible-content-height)",
          },
        },
        collapsableSlideUp: {
          from: {
            height: "var(--radix-collapsible-content-height)",
          },
          to: {
            height: "0",
          },
        },

        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.65",
          },
        },
      },

      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
        collapsableShow: "collapsableSlideDown 80ms ease-out",
        collapsableHide: "collapsableSlideUp 80ms ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("autoprefixer"),
    require("tailwindcss"),
  ],
} satisfies Config;
