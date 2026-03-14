import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'base-100': 'hsl(var(--base-100))',
        'base-200': 'hsl(var(--base-200))',
        'base-300': 'hsl(var(--base-300))',
        'base-content': 'hsl(var(--base-content))',
        primary: 'hsl(var(--primary))',
        'primary-content': 'hsl(var(--primary-content))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        neutral: 'hsl(var(--neutral))',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
