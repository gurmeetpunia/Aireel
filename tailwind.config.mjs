import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        primary: "#00FFF7",
        orange: "#FF5F1F",
        accent: "#C4F0FF",
        neon: {
          aqua: "#00FFF7",
          orange: "#FF5F1F",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", ...fontFamily.sans],
        ibmplex: ['"IBM Plex Mono"', ...fontFamily.mono],
      },
      boxShadow: {
        neon: "0 0 8px 2px #00FFF7, 0 0 16px 4px #FF5F1F",
        glass:
          "0 4px 32px 0 rgba(0,255,247,0.12), 0 1.5px 8px 0 rgba(196,240,255,0.10)",
      },
      backdropBlur: {
        glass: "8px",
      },
      backgroundImage: {
        scanlines:
          "repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(0,255,247,0.05) 3px, transparent 4px)",
        "holo-gradient": "linear-gradient(135deg, #00FFF7 0%, #FF5F1F 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
