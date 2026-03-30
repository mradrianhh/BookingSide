import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          400: '#cbd5e1',
          300: '#e2e8f0',
          200: '#f1f5f9',
        },
        cyan: {
          400: '#06b6d4',
          300: '#22d3ee',
        },
        blue: {
          500: '#3b82f6',
          400: '#60a5fa',
        },
        teal: {
          400: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}
export default config
