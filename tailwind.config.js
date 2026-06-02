/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(240 10% 3.5%)',
        surface: 'hsl(240 8% 7%)',
        foreground: 'hsl(0 0% 98%)',
        muted: 'hsl(240 5% 64.9%)',
        border: 'hsl(240 4% 16%)',
        momentum: 'hsl(160 65% 55%)',
        time: 'hsl(224 76% 58%)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Anton"',
          '"Anton Fallback"',
          '"Oswald"',
          '"Arial Narrow"',
          'Impact',
          'Haettenschweiler',
          '"Franklin Gothic Bold"',
          '"Arial Black"',
          'sans-serif',
        ],
      },
      maxWidth: {
        container: '72rem',
      },
    },
  },
  plugins: [],
}
