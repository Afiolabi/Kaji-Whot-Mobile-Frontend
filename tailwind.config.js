/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Airbnb-inspired color palette
        primary: {
          DEFAULT: "#FF385C", // Airbnb Rausch
          50: "#FFE8ED",
          100: "#FFD1DB",
          200: "#FFA3B7",
          300: "#FF7593",
          400: "#FF476F",
          500: "#FF385C",
          600: "#E6003D",
          700: "#B3002F",
          800: "#800021",
          900: "#4D0013",
        },
        secondary: {
          DEFAULT: "#00A699", // Teal
          50: "#E6F7F6",
          100: "#CCEFED",
          200: "#99DFDB",
          300: "#66CFC9",
          400: "#33BFB7",
          500: "#00A699",
          600: "#00857A",
          700: "#00645B",
          800: "#00423D",
          900: "#00211E",
        },
        neutral: {
          50: "#F7F7F7",
          100: "#EBEBEB",
          200: "#DDDDDD",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6A6A6A",
          600: "#484848", // Airbnb main text
          700: "#383838",
          800: "#282828",
          900: "#181818",
        },
        success: "#00A699",
        warning: "#FFB400",
        error: "#C13515",
        info: "#008489",
      },
      fontFamily: {
        sans: ["System"],
        // You can add custom fonts here
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.12)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.18)",
      },
      animation: {
        'turn-pulse': 'turn-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'card-flip': 'card-flip 0.6s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'turn-pulse': {
          '0%, 100%': { 
            borderColor: '#8b51f5',
            boxShadow: '0 0 0 0 rgba(139, 81, 245, 0.7)' 
          },
          '50%': { 
            borderColor: '#c238eb',
            boxShadow: '0 0 0 10px rgba(139, 81, 245, 0)' 
          },
        },
        'card-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};