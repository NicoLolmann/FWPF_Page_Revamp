import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      colors: {
        ink: "#171717",
        paper: "#ece6dc",
        grid: "#d4cabd",
        ballot: "#ffffff",
        mint: "#d9eadc",
        sky: "#d9dee2",
        amber: "#e6c878",
        coral: "#e9b3b6",
        violet: "#d6ccc0",
        ohm: "#c9232d",
        "ohm-soft": "#f3d8da",
      },
      boxShadow: {
        pixel: "6px 6px 0 #171717",
        "pixel-sm": "4px 4px 0 #171717",
        "pixel-inset": "inset 4px 4px 0 rgba(23, 23, 23, 0.12)",
      },
      fontFamily: {
        pixel: [
          "var(--font-pixel)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
