/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "subtle-movement": "subtle-movement 20s ease-in-out infinite",
      },
      keyframes: {
        "subtle-movement": {
          "0%": { transform: "scale(1.01) translate(0, 0)" },
          "50%": { transform: "scale(1.02) translate(-0.5%, -0.5%)" },
          "100%": { transform: "scale(1.01) translate(0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
