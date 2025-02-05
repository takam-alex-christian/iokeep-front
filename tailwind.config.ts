import type { Config } from "tailwindcss";

import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  darkMode: "selector",
  plugins: [
    heroui({
      themes: {
        light: {
          extend: "light",
          colors: {
            background: {
              DEFAULT: "#ffffff",
            },
            foreground: {
              DEFAULT: "#01012e",
            },
            // primary: { DEFAULT: "#2323ff", foreground: "#ffffff" },
          },
        },
      },
    }),
  ],
};
export default config;
