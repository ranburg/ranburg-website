import type { Config } from "tailwindcss";

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
        slate: {
          950: "#0B1220",
        },
        cream: {
          DEFAULT: "#F4F1EB",
        },
        navy: {
          DEFAULT: "#0B1220",
        },
        accent: {
          DEFAULT: "var(--accent)",
          emerald: "var(--accent-emerald)",
          glow: "var(--accent-soft)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "var(--font-noto-sans)", "system-ui", "sans-serif"],
        hi: ["var(--font-noto-devanagari)", "var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        ar: ["var(--font-noto-arabic)", "var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        ja: ["var(--font-noto-jp)", "var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        ko: ["var(--font-noto-kr)", "var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(13, 155, 138, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 155, 138, 0.06) 1px, transparent 1px)",
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
    },
  },
  plugins: [],
};

export default config;
