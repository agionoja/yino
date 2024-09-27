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
      },
      fontFamily: {
        inter: `"Inter", system-ui;`,
      },
    },
  },
  plugins: [],
} satisfies Config;
