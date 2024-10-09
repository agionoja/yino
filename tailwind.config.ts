import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {},
      colors: {
        blue: "#2776ea",
        "payne-gray": "#4b5768",
        "french-gray": "#d0d5dd",
        "anti-flash-white": "#e4e7eb",
        "dark-jungle-green": "#1E1E1E",
        "text-gray": "#666666",
        "imgage-bg": "#BCD5F8",
        "dark-blue": "#103262",
      },
      fontFamily: {
        inter: `"Inter", system-ui;`,
        "anti-flash-white": "rgba(228,231,235,0.6)",
        manrope: `"Manrope", sans-serif`,
      },
    },
  },
  plugins: [],
} satisfies Config;
