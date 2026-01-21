/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      // TÄMÄ ON TÄRKEÄ FONTEILLE
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        playfair: ['Playfair Display', 'serif'],
        oswald: ['Oswald', 'sans-serif'],
        public: ['Public Sans', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        fira: ['Fira Code', 'monospace'],
        roboto: ['Roboto Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}