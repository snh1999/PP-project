import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1E40AF',     // Deep blue
          secondary: '#10B981',   // Emerald green
          background: '#111827',  // Very dark blue-gray
          text: '#F9FAFB',        // Light gray
          accent: '#6366F1',      // Indigo
        },
        light: {
          primary: '#3B82F6',     // Bright blue
          secondary: '#34D399',   // Mint green
          background: '#FFFFFF',  // White
          text: '#1F2937',        // Dark gray
          accent: '#8B5CF6',      // Purple
        }
      }
    }
  }
};

export default config;
