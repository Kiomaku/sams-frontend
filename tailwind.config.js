import { heroui } from "@heroui/react";
import { createRequire } from "node:module";
import path from "node:path";

// Find wherever npm/pnpm actually put @heroui/theme, so Tailwind always scans its classes.
const require = createRequire(import.meta.url);
const themeGlobs = [];
try {
  const fromReact = createRequire(require.resolve("@heroui/react"));
  themeGlobs.push(path.join(path.dirname(fromReact.resolve("@heroui/theme")), "**/*.{js,mjs}").replace(/\\/g, "/"));
} catch {}

const brand = { DEFAULT: "#1a8cff", foreground: "#ffffff" };

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@heroui/*/dist/**/*.{js,mjs}",
    "./node_modules/.pnpm/@heroui+*/node_modules/@heroui/*/dist/**/*.{js,mjs}",
    ...themeGlobs,
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#111111",           // page
            foreground: "#ececec",
            content1: "#151515",             // sidebar, cards, popovers
            content2: "#20201f",             // inputs, user bubbles, hover/selected rows
            content3: "#20201f",
            content4: "#20201f",
            divider: "rgba(255,255,255,0.08)",
            primary: brand,
            default: {
              50: "#151515", 100: "#20201f", 200: "#2b2b2a", 300: "#3a3a38", 400: "#5c5c59",
              500: "#8a8a86", 600: "#aaaaa6", 700: "#c6c6c2", 800: "#e0e0dc", 900: "#f2f2ef",
              DEFAULT: "#2b2b2a", foreground: "#ececec",
            },
          },
        },
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#0d0d0d",
            content1: "#f9f9f9",
            content2: "#f0f0ef",
            content3: "#f0f0ef",
            content4: "#e4e4e2",
            divider: "rgba(0,0,0,0.08)",
            primary: brand,
            default: {
              50: "#f9f9f9", 100: "#f0f0ef", 200: "#e4e4e2", 300: "#d0d0cd", 400: "#a8a8a4",
              500: "#7c7c78", 600: "#5c5c58", 700: "#3f3f3c", 800: "#262624", 900: "#0d0d0d",
              DEFAULT: "#e4e4e2", foreground: "#0d0d0d",
            },
          },
        },
      },
    }),
  ],
};
