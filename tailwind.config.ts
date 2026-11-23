import type { Config } from "tailwindcss";

/** Neutral (non-blue) grey ramp so legacy `slate-*` / `gray-*` utilities match the near-black canvas. */
const neutralRamp = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
  950: "#0d0d0d",
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: neutralRamp,
        gray: neutralRamp,
        cream: {
          DEFAULT: "#F4F1EB",
        },
        navy: {
          DEFAULT: "#0D0D0D",
        },
        ink: {
          DEFAULT: "#0D0D0D",
          soft: "#1D1D1D",
        },
        accent: {
          DEFAULT: "var(--accent)",
          emerald: "var(--accent-emerald)",
          glow: "var(--accent-soft)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-noto-sans)", "system-ui", "sans-serif"],
        hi: ["var(--font-noto-devanagari)", "var(--font-poppins)", "system-ui", "sans-serif"],
        ar: ["var(--font-noto-arabic)", "var(--font-poppins)", "system-ui", "sans-serif"],
        ja: ["var(--font-noto-jp)", "var(--font-poppins)", "system-ui", "sans-serif"],
        ko: ["var(--font-noto-kr)", "var(--font-poppins)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "Segoe Script", "cursive"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--accent) 20%, transparent), transparent)",
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgb(var(--shadow-color) / 0.16), inset 0 1px 0 rgba(244, 241, 235, 0.05)",
        glow: "0 0 36px color-mix(in srgb, var(--accent) 28%, transparent)",
        "glow-emerald": "0 0 36px color-mix(in srgb, var(--accent) 28%, transparent)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
