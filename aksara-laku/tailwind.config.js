/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Warna Primary (F&B Theme)
        primary: "#162740",
        "dark-blue": "#162740",
        ink: {
          DEFAULT: "#162740",
          soft: "#334862",
        },
        "grey-brown": "#77642e",
        accent: "#77642e",
        turmeric: {
          DEFAULT: "#77642e",
          dark: "#5c4d23",
        },
        cream: "#FDFBF7",
        paper: {
          DEFAULT: "#FDFBF7",
          dim: "#f3ede2",
        },
        card: "#FFFFFF",
        modal: "#FFFFFF",
        line: "#e3ded5",

        // Accent / CTA (Terracotta Orange & Warm Amber)
        terracotta: {
          DEFAULT: "#D9534F",
          hover: "#c9433f",
        },
        chili: {
          DEFAULT: "#D9534F",
          hover: "#c9433f",
        },
        "warm-amber": {
          DEFAULT: "#E67E22",
          hover: "#d35400",
        },
        amber: {
          DEFAULT: "#E67E22",
          hover: "#d35400",
        },
        basil: "#2f6b45",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        card: "1rem",
        modal: "1rem",
      },
      boxShadow: {
        sm: "0 1px 3px 0 rgba(22, 39, 64, 0.05), 0 1px 2px -1px rgba(22, 39, 64, 0.05)",
        md: "0 4px 6px -1px rgba(22, 39, 64, 0.07), 0 2px 4px -2px rgba(22, 39, 64, 0.05)",
        lg: "0 10px 15px -3px rgba(22, 39, 64, 0.08), 0 4px 6px -4px rgba(22, 39, 64, 0.05)",
      },
      transitionDuration: {
        300: "300ms",
      },
      transitionTimingFunction: {
        "in-out": "ease-in-out",
      },
    },
  },
  plugins: [],
};
