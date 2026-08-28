import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        navy: {
          900: "#0b132b",
          800: "#1c2541",
          700: "#3a506b",
        },
        hazard: {
          low: "#10b981",       // Green
          moderate: "#f59e0b",  // Amber
          high: "#f97316",      // Orange
          extreme: "#ef4444",   // Red
          unknown: "#64748b",   // Slate
        },
      },
    },
  },
  plugins: [],
};
export default config;
