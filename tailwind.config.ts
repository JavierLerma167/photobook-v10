import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        evr: {
          bg: '#0f1115',
          panel: '#171a21',
          border: '#252a33',
          hover: '#1f242d',
          accent: '#e8b04b',
          accentHover: '#f0c069',
          text: '#e6e8ec',
          muted: '#8b94a3'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
export default config;