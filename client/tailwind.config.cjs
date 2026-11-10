/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        soft: '0 12px 40px -18px rgba(15, 23, 42, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        sindh: {
          primary: '#0f766e',
          'primary-content': '#ecfdf5',
          secondary: '#f59e0b',
          'secondary-content': '#451a03',
          accent: '#6366f1',
          'accent-content': '#eef2ff',
          neutral: '#1e293b',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f1f5f9',
          'base-300': '#e2e8f0',
          'base-content': '#0f172a',
          info: '#0ea5e9',
          'info-content': '#f0f9ff',
          success: '#16a34a',
          'success-content': '#f0fdf4',
          warning: '#f59e0b',
          'warning-content': '#451a03',
          error: '#dc2626',
          'error-content': '#fef2f2',
          '--rounded-box': '1.25rem',
          '--rounded-btn': '0.85rem',
          '--rounded-badge': '1rem',
          '--border-btn': '1px',
          '--tab-radius': '0.7rem',
          '--animation-btn': '0.2s',
          '--btn-text-case': 'none',
        },
      },
    ],
  },
};
