/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '4rem',
        DEFAULT: '1rem',
        lg: '3rem',
        md: '2rem',
        sm: '1.2rem',
        xl: '3rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      // fontFamily: {
      //   mono: ['var(--font-geist-mono)'],
      //   sans: ['var(--font-geist-sans)'],
      // },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text)',
            '--tw-prose-headings': 'var(--text)',
            flexShrink: '0',
            h1: {
              fontSize: '2.6rem',
              marginBottom: '0.5rem',
            },
            h2: {
              fontSize: '2.2rem',
              marginTop: '0rem',
              marginBottom: '0rem',
              paddingTop: '1.2rem',
              paddingBottom: '0rem',
            },
            h3: {
              fontSize: '2rem',
              marginTop: '0rem',
              marginBottom: '0rem',
              paddingTop: '0rem',
              paddingBottom: '0rem',
            },
            h4: {
              fontSize: '1.5rem',
              marginTop: '0rem',
              marginBottom: '0rem',
              fontWeight: 'medium',
            },
            p: {
              fontSize: '1.2rem',
              marginTop: '0rem',
              marginBottom: '1rem',
              paddingTop: '0rem',
              paddingBottom: '0rem',
            },
          },
        },
      }),
    },
  },
}
