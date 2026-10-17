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
        // Dynamic Design Tokens matching SignBridge AI Theme
        bgMain: 'var(--color-bg)',
        cardBg: 'var(--color-surface)',
        cardBgAlt: 'var(--color-surface-alt)',
        textPrimary: 'var(--color-heading)',
        textSecondary: 'var(--color-muted)',
        primaryAction: 'var(--color-brand)',
        primaryActionHover: 'var(--color-brand-hover)',
        borderMain: 'var(--color-border)',
        selectedItem: 'var(--color-selected)',

        // Official User Palette Constants
        darkBlur: '#0B1F2A',
        deepNavy: '#071522',
        glassTeal: '#00C9C8',
        softCyan: '#64D2D2',
        glassBorder: '#28566B',
        primaryText: '#F1F5F9',

        // Brand Teal Spectrum (centered on Glass Teal #00C9C8 & Soft Cyan #64D2D2)
        brand: {
          50: '#E6FAF9',
          100: '#CCF5F4',
          200: '#99ECE9',
          300: '#64D2D2',
          400: '#33D0CE',
          500: '#00C9C8',
          600: '#00C9C8',
          700: '#00A8A7',
          800: '#008786',
          900: '#071522',
          950: '#030A11',
        },
        // Deep Navy Spectrum (centered on Deep Navy #071522 & Dark Blur #0B1F2A)
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#28566B',
          600: '#1E4354',
          700: '#142E3B',
          800: '#102A38',
          850: '#0B1F2A',
          900: '#071522',
          950: '#030A11',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 25px -5px rgba(0, 201, 200, 0.35)',
      }
    },
  },
  plugins: [],
}
