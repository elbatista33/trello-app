/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: "#404040",
        orange: "#FFA62B",
        bleu: "#16697A",
        gray2: "#EDE7E3",
        bleu2: "#82C0CC",
      },
    },
  },
  plugins: [],
};
