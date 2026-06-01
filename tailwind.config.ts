import type { Config } from "tailwindcss";

/**
 * Perla powered by Hung Phat — Tailwind Design System
 *
 * Palette: Imperial Sapphire & Champagne
 * Target Audience: High-class interior design customers
 * Contrast Ratios (WCAG):
 *   - sapphire-deep / linen :  15.6:1  (AAA)
 *   - sapphire-deep / champagne: ~4.7:1 (AA for large text & UI)
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/page-sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    // ─── Breakpoints ──────────────────────────────────────────────────────────
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    extend: {
      // ─── Brand Color Palette ────────────────────────────────────────────────
      colors: {
        // Core brand surfaces
        sapphire: {
          deep: "#071A2B",       // Primary dark — background / high-contrast text
          ocean: "#0E2A42",      // Secondary dark — cards, elevated surfaces
          mist: "#1A3D5C",       // Tertiary — subtle borders, dividers
          faint: "#E8EEF4",      // Very light sapphire tint for hover backgrounds
        },

        // Luxury accent
        champagne: {
          DEFAULT: "#D4B886",    // Primary accent — icons, decorative lines, hover states
          light: "#E8D5B0",      // Soft champagne — subtle highlights
          deep: "#A88E60",       // Dark champagne — pressed states
        },

        // Neutral surfaces
        linen: {
          DEFAULT: "#F4F4F6",    // Crisp linen — light mode background
          warm: "#EEEAE4",       // Warm linen — sections alternate
          dark: "#D6D3CC",       // Linen border — subtle separators
        },

        // Semantic roles (maps to brand primitives above)
        brand: {
          bg: "#071A2B",         // Page background (dark mode)
          surface: "#0E2A42",    // Card / section surface
          border: "#1A3D5C",     // Border color
          accent: "#D4B886",     // Interactive accent
          "accent-hover": "#A88E60",
          text: {
            primary: "#F4F4F6",  // Primary body text on dark bg
            secondary: "#D4B886",// Accent / subheading on dark bg
            muted: "#8FA3B8",    // Muted / helper text
            inverse: "#071A2B",  // Text on light backgrounds
          },
        },
      },

      // ─── Typography Scale ────────────────────────────────────────────────────
      fontFamily: {
        // Serif — Cormorant Garamond: timeless elegance for headings
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        // Sans — Jost: clean, modern, high-legibility for body & UI
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
        // Display — Cormorant SC: small-caps variant for labels & decorative use
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },

      fontSize: {
        // ── Display / Hero ────────────────────────────────
        "display-2xl": [
          "72px",
          { lineHeight: "80px", letterSpacing: "-0.02em", fontWeight: "300" },
        ],
        "display-xl": [
          "60px",
          { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "300" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "60px", letterSpacing: "-0.01em", fontWeight: "300" },
        ],

        // ── Headings ──────────────────────────────────────
        h1: [
          "40px",
          { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        h2: [
          "32px",
          { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        h3: [
          "26px",
          { lineHeight: "36px", letterSpacing: "0em", fontWeight: "500" },
        ],
        h4: [
          "22px",
          { lineHeight: "32px", letterSpacing: "0em", fontWeight: "500" },
        ],
        h5: [
          "18px",
          { lineHeight: "28px", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        h6: [
          "16px",
          { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "600" },
        ],

        // ── Body ──────────────────────────────────────────
        "body-lg": [
          "18px",
          { lineHeight: "30px", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        body: [
          "16px",
          { lineHeight: "26px", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "body-sm": [
          "14px",
          { lineHeight: "22px", letterSpacing: "0.01em", fontWeight: "400" },
        ],

        // ── Labels / UI ───────────────────────────────────
        label: [
          "13px",
          { lineHeight: "20px", letterSpacing: "0.08em", fontWeight: "500" },
        ],
        "label-sm": [
          "11px",
          { lineHeight: "16px", letterSpacing: "0.10em", fontWeight: "500" },
        ],

        // ── Footnote / Legal ──────────────────────────────
        footnote: [
          "12px",
          { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        caption: [
          "11px",
          { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "400" },
        ],
      },

      // ─── Letter Spacing ──────────────────────────────────────────────────────
      letterSpacing: {
        widest: "0.25em",   // Decorative labels in all-caps
        wider: "0.15em",
        wide: "0.08em",
      },

      // ─── Line Height ─────────────────────────────────────────────────────────
      lineHeight: {
        "extra-tight": "1.1",
        tight: "1.25",
        snug: "1.35",
        comfortable: "1.625",
        relaxed: "1.75",
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Box Shadow ──────────────────────────────────────────────────────────
      boxShadow: {
        luxury:
          "0 4px 32px 0 rgba(7, 26, 43, 0.25), 0 1px 4px 0 rgba(7, 26, 43, 0.15)",
        "luxury-lg":
          "0 12px 64px 0 rgba(7, 26, 43, 0.35), 0 4px 16px 0 rgba(7, 26, 43, 0.20)",
        champagne:
          "0 4px 24px 0 rgba(212, 184, 134, 0.18), 0 1px 6px 0 rgba(212, 184, 134, 0.10)",
        "inner-sm": "inset 0 1px 4px 0 rgba(7, 26, 43, 0.2)",
      },

      // ─── Background Images ────────────────────────────────────────────────────
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "sapphire-to-ocean":
          "linear-gradient(to bottom, #071A2B, #0E2A42)",
        "champagne-shimmer":
          "linear-gradient(105deg, #D4B886 0%, #E8D5B0 50%, #D4B886 100%)",
        "hero-overlay":
          "linear-gradient(to right bottom, rgba(7,26,43,0.80), rgba(7,26,43,0.60))",
      },

      // ─── Transitions ─────────────────────────────────────────────────────────
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      // ─── Motion (About page enter + blueprint draw) ───────────────────────────
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(1.5rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "parallax-y": {
          from: { transform: "translateY(calc(-1 * var(--parallax-range, 40px)))" },
          to: { transform: "translateY(var(--parallax-range, 40px))" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        "draw-line": "draw-line 1.2s ease-out both",
        "parallax-y": "parallax-y linear both",
      },
    },
  },

  plugins: [],
};

export default config;
