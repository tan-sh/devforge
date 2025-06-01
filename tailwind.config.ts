import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "border-flow": {
          "0%, 100%": { clipPath: "inset(0 0 98% 0)" },
          "25%": { clipPath: "inset(0 98% 0 0)" },
          "50%": { clipPath: "inset(98% 0 0 0)" },
          "75%": { clipPath: "inset(0 0 0 98%)" },
        },
        "glow-line-horizontal": {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
        "glow-line-vertical": {
          "0%, 100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        sparkle: {
          "0%, 100%": {
            opacity: "0",
            transform: "scale(0) translate(-50%, -50%)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1) translate(-50%, -50%)",
          }
        },
        "text-shimmer": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
        "matrix-fade": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
        },
        "grid-fade": {
          "0%": {
            opacity: "0",
            transform: "scale(0.96)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "border-flow": "border-flow 4s linear infinite",
        "glow-line-horizontal": "glow-line-horizontal 3s ease-in-out infinite",
        "glow-line-vertical": "glow-line-vertical 3s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "scale-up": "scale-up 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "text-shimmer": "text-shimmer 2s linear infinite",
        "matrix-fade": "matrix-fade 1.5s ease-out forwards",
        "grid-fade": "grid-fade 0.5s ease-out forwards",
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)',
        'neon-strong': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT), 0 0 40px theme(colors.primary.DEFAULT)',
        'inner-glow': 'inset 0 0 20px theme(colors.primary.DEFAULT)',
        'glow-sm': '0 0 10px rgba(var(--primary), 0.3)',
        'glow-md': '0 0 15px rgba(var(--primary), 0.4)',
        'glow-lg': '0 0 20px rgba(var(--primary), 0.5)',
      },
      backgroundImage: {
        'gradient-radial-top': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'gradient-radial-bottom': 'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from var(--angle, 0deg), var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(var(--primary), 0.4), transparent)',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

export default config 