import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#f7f6f3",
        lilac: "#cbb5ff",
      },
      fontFamily: {
        sans: ["DM Sans", "Arial", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
