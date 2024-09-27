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
<<<<<<< HEAD
        "anti-flash-white": "#e4e7eb",
        "dark-jungle-green": "#1E1E1E",
      },
      fontFamily: {
        inter: `"Inter", system-ui;`,
=======
        "anti-flash-white": "rgba(228,231,235,0.6)",
>>>>>>> d2c9dd38e49dcb2fd1ccd7c8d5752ef16e3062bf
      },
    },
  },
  plugins: [],
} satisfies Config;
