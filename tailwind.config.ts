import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#071411",
        },
        accent: {
          DEFAULT: "var(--accent)",
          emerald: "var(--accent-emerald)",
          glow: "var(--accent-soft)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(15, 118, 110, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 118, 110, 0.05) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(15, 118, 110, 0.22), transparent)",
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
        glass: "0 8px 32px rgba(7, 20, 17, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        glow: "0 0 36px rgba(15, 118, 110, 0.28)",
        "glow-emerald": "0 0 36px rgba(5, 150, 105, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
