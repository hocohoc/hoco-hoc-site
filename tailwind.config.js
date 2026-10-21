/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter, Arial)', 'Arial', 'sans-serif'],
        mono: ['var(--font-jbm, monospace)', 'ui-monospace', 'monospace']
      },
      colors: {
        "blurple": "#737efa",
        "blurple-accent": "#616eff"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%', // add required value here
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
