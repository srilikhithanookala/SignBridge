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
      }
    }
  }
}
