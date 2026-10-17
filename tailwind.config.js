/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bgMain: 'var(--color-bg)',
        cardBg: 'var(--color-surface)',
        cardBgAlt: 'var(--color-surface-alt)',
        textPrimary: 'var(--color-heading)',
        textSecondary: 'var(--color-muted)',
        primaryAction: 'var(--color-brand)',
        primaryActionHover: 'var(--color-brand-hover)',
        borderMain: 'var(--color-border)',
        selectedItem: 'var(--color-selected)',

        brand: {
          50: '#E8F4F4',
          100: '#D9EEEE',
          200: '#B2E2E2',
          300: '#8BE3E3',
          400: '#64D2D2',
          500: '#287D8E',
          600: '#287D8E',
          700: '#216878',
          800: '#1A5360',
          900: '#142D4E',
          950: '#101B2A',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#22374A',
          850: '#182638',
          900: '#142D4E',
          950: '#101B2A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 27, 42, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(100, 210, 210, 0.35)',
      }
    },
  },
  plugins: [],
}
