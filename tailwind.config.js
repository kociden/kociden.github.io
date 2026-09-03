/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './designs/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        grotesk: ['Space Grotesk', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        mincho: ['Shippori Mincho', 'serif'],
        serif: ['Instrument Serif', 'Shippori Mincho', 'serif'],
      },
    },
  },
  plugins: [],
}
