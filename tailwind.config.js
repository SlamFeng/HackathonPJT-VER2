/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "rgb(var(--lp-ink-950) / <alpha-value>)",
          900: "rgb(var(--lp-ink-900) / <alpha-value>)",
          850: "rgb(var(--lp-ink-850) / <alpha-value>)",
          800: "rgb(var(--lp-ink-800) / <alpha-value>)",
          700: "rgb(var(--lp-ink-700) / <alpha-value>)",
        },
        mist: {
          50: "rgb(var(--lp-mist-50) / <alpha-value>)",
          100: "rgb(var(--lp-mist-100) / <alpha-value>)",
          200: "rgb(var(--lp-mist-200) / <alpha-value>)",
          300: "rgb(var(--lp-mist-300) / <alpha-value>)",
        },
        aurora: {
          50: "rgb(var(--lp-aurora-50) / <alpha-value>)",
          100: "rgb(var(--lp-aurora-100) / <alpha-value>)",
          200: "rgb(var(--lp-aurora-200) / <alpha-value>)",
          300: "rgb(var(--lp-aurora-300) / <alpha-value>)",
          400: "rgb(var(--lp-aurora-400) / <alpha-value>)",
          500: "rgb(var(--lp-aurora-500) / <alpha-value>)",
          600: "rgb(var(--lp-aurora-600) / <alpha-value>)",
        },
        alloy: {
          50: "rgb(var(--lp-alloy-50) / <alpha-value>)",
          100: "rgb(var(--lp-alloy-100) / <alpha-value>)",
          200: "rgb(var(--lp-alloy-200) / <alpha-value>)",
          300: "rgb(var(--lp-alloy-300) / <alpha-value>)",
          400: "rgb(var(--lp-alloy-400) / <alpha-value>)",
          500: "rgb(var(--lp-alloy-500) / <alpha-value>)",
          600: "rgb(var(--lp-alloy-600) / <alpha-value>)",
        },
        champagne: {
          50: "rgb(var(--lp-champagne-50) / <alpha-value>)",
          100: "rgb(var(--lp-champagne-100) / <alpha-value>)",
          200: "rgb(var(--lp-champagne-200) / <alpha-value>)",
          300: "rgb(var(--lp-champagne-300) / <alpha-value>)",
          400: "rgb(var(--lp-champagne-400) / <alpha-value>)",
          500: "rgb(var(--lp-champagne-500) / <alpha-value>)",
        },
        success: {
          50: "rgb(var(--lp-success-50) / <alpha-value>)",
          100: "rgb(var(--lp-success-100) / <alpha-value>)",
          200: "rgb(var(--lp-success-200) / <alpha-value>)",
          300: "rgb(var(--lp-success-300) / <alpha-value>)",
          400: "rgb(var(--lp-success-400) / <alpha-value>)",
          500: "rgb(var(--lp-success-500) / <alpha-value>)",
          600: "rgb(var(--lp-success-600) / <alpha-value>)",
        },
        warning: {
          50: "rgb(var(--lp-warning-50) / <alpha-value>)",
          100: "rgb(var(--lp-warning-100) / <alpha-value>)",
          200: "rgb(var(--lp-warning-200) / <alpha-value>)",
          300: "rgb(var(--lp-warning-300) / <alpha-value>)",
          400: "rgb(var(--lp-warning-400) / <alpha-value>)",
          500: "rgb(var(--lp-warning-500) / <alpha-value>)",
          600: "rgb(var(--lp-warning-600) / <alpha-value>)",
        },
        danger: {
          50: "rgb(var(--lp-danger-50) / <alpha-value>)",
          100: "rgb(var(--lp-danger-100) / <alpha-value>)",
          200: "rgb(var(--lp-danger-200) / <alpha-value>)",
          300: "rgb(var(--lp-danger-300) / <alpha-value>)",
          400: "rgb(var(--lp-danger-400) / <alpha-value>)",
          500: "rgb(var(--lp-danger-500) / <alpha-value>)",
          600: "rgb(var(--lp-danger-600) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.55)",
        glass: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 0 0 1px rgba(255,255,255,0.05), 0 28px 70px rgba(0,0,0,0.55)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translate3d(0, 12px, 0) scale(0.99)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.95" },
        },
      },
      animation: {
        floatIn: "floatIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        shimmer: "shimmer 6s ease-in-out infinite alternate",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
