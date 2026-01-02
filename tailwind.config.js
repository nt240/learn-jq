/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "text-sky-700",
    "text-emerald-700",
    "text-amber-700",
    "text-violet-700",
    "text-slate-400",
    "text-slate-900",
    "font-semibold",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
