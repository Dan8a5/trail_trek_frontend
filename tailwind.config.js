/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // This tells Tailwind where to look for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],  // Add DaisyUI plugin
  daisyui: {
    themes: ["light", "dark"],    // Add themes you want to use
  }
}