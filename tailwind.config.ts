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
          base:     "#04030b",   // deep space black
          raised:   "#08071a",   // slightly elevated surface
          elevated: "#0d0b22",   // card surfaces
          subtle:   "#13102e",   // subtle variant
        },
        border: {
          subtle:  "#1c1938",
          default: "#28234f",
          strong:  "#3e3770",
        },
        text: {
          primary:   "#edeaff",  // near-white, slight violet
          secondary: "#9490b8",  // medium violet-grey
          tertiary:  "#625e82",  // dim violet-grey
          muted:     "#3d395a",  // very dim
        },
        accent: {
          DEFAULT: "#8875d4",    // muted violet/purple — space
          muted:   "#6455a8",
          subtle:  "rgba(136, 117, 212, 0.14)",
        },
        danger:  "#f87171",
        warn:    "#fbbf24",
        success: "#34d399",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.25rem)",    { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "display":    ["clamp(1.5rem, 3vw, 2.25rem)",  { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(ellipse at top, rgba(136, 117, 212, 0.07), transparent 60%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in":    "fade-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
