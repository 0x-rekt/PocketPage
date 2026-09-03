/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0B0E1A",
        "bg-surface": "#151A2E",
        "bg-surface-raised": "#1C2340",
        "accent-primary": "#5B6EF5",
        "accent-primary-hover": "#4A5AE0",
        "status-critical": "#F5484B",
        "status-warning": "#F5A623",
        "status-success": "#3DD68C",
        "status-muted": "#6B7280",
        "text-primary": "#F5F6FA",
        "text-secondary": "#9AA1B9",
        "border-subtle": "#252B47",
      },
    },
  },
  plugins: [],
};