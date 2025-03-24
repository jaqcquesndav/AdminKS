/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        interactive: {
          DEFAULT: 'var(--color-interactive)',
          light: 'var(--color-interactive-light)',
          dark: 'var(--color-interactive-dark)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities, theme }) {
      const colors = theme('colors');
      const utilities = {};
      
      // Generate opacity variants for primary color
      const opacityValues = {
        '10': '0.1',
        '20': '0.2',
        '40': '0.4',
        '60': '0.6',
        '80': '0.8'
      };

      Object.entries(opacityValues).forEach(([key, value]) => {
        utilities[`.bg-primary\\/${key}`] = {
          'background-color': `rgb(var(--color-primary-rgb) / ${value})`
        };
        utilities[`.text-primary\\/${key}`] = {
          'color': `rgb(var(--color-primary-rgb) / ${value})`
        };
        utilities[`.border-primary\\/${key}`] = {
          'border-color': `rgb(var(--color-primary-rgb) / ${value})`
        };
        utilities[`.ring-primary\\/${key}`] = {
          '--tw-ring-color': `rgb(var(--color-primary-rgb) / ${value})`
        };
      });

      addUtilities(utilities);
    }
  ],
};