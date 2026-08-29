/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        ink: '#0A1A2F',
        accent: '#2C9FA2',
        body: '#5A6B7A',
        warm: '#F4E9DD',
        line: '#D9D9D9',
        surface: '#F6D8C8',
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 26, 47, 0.05), 0 8px 24px rgba(10, 26, 47, 0.08)',
        'card-active': '0 2px 4px rgba(10, 26, 47, 0.06), 0 14px 36px rgba(10, 26, 47, 0.14)',
        pressed: 'inset 0 2px 5px rgba(10, 26, 47, 0.12), 0 2px 6px rgba(10, 26, 47, 0.06)',
      },
    },
  },
  plugins: [],
}
