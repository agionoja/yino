import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "dotted-pattern":
          "linear-gradient(rgba(232, 244, 248, 0.95), rgba(244, 245, 247, 0.98)), url('/app/assets/images/auth-bg.png')",
        "chat-pattern":
          "linear-gradient(rgba(233, 241, 253, 0.9), rgba(233, 241, 253, 0.96)), url('/app/assets/images/chat-pattern.webp')",
      },
      colors: {
        blue: "#2776ea",
        "payne-gray": "#4b5768",
        "french-gray": "#d0d5dd",
        "anti-flash-white": "#e4e7eb",
        "dark-jungle-green": "#1E1E1E",
        "off-black": "#1e1e1e",
        "dark-brown": "#343434",
        "light-brown": "rgba(89,88,88,0.74)",
        "alice-blue": "#e9f1fd",
      },
      fontFamily: {
        inter: `"Inter", system-ui;`,
        "anti-flash-white": "rgba(228,231,235,0.6)",
      },

      fontSize: {},
    },
  },
  plugins: [],
} satisfies Config;
