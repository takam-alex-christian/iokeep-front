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
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      // prefix: "heroui",
      themes: {
        light: {
          colors: {
            background: { DEFAULT: "#fafaff" },
            foreground: { DEFAULT: "#01012e" },
            // content1: {},
            primary: {
              // "100": "#D3D3FF",
              // "200": "#A6A6FF",
              // "300": "#7A7AFF",
              // "400": "#5959FF",
              // "500": "#2323FF",
              // "600": "#1919DB",
              // "700": "#1111B7",
              // "800": "#0B0B93",
              // "900": "#06067A",
              DEFAULT: "#8614cc",
              // foreground: "#e5eeff",
            },
            secondary: {
              DEFAULT: "#8614cc",

              // foreground: "#f2eafc",
            },
            focus: {
              DEFAULT: "#8614cc",
            },
            // secondary: {
            //   DEFAULT: "",
            // },
          },
        },
        dark: {
          colors: {
            background: "#01012e",
            foreground: "#f2eafc",
            primary: "#8614cc",
          },
        },
      },
    }),
  ],
};
export default config;
