import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0b",
          raised: "#111113",
          elevated: "#16161a",
          subtle: "#1c1c21",
        },
        border: {
          subtle: "#26262d",
          default: "#2e2e36",
          strong: "#3a3a45",
        },
        text: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          tertiary: "#71717a",
          muted: "#52525b",
        },
        accent: {
          DEFAULT: "#a3e635",
          muted: "#84cc16",
          subtle: "rgba(163, 230, 53, 0.1)",
        },
        danger: "#f87171",
        warn: "#fbbf24",
        success: "#34d399",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(ellipse at top, rgba(163, 230, 53, 0.06), transparent 60%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
