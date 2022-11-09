/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      'xxs': '.5rem',
      '2xs': '.6rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      spacing: {
        '110': '27rem',
        '114': '28rem',
        '118': '29rem',
        '128': '32rem',
        '144': '36rem',
        '166': '42rem',
        '200': '50rem'
      },
      borderRadius: {
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      textUnderlineOffset: {
        12: '12px',
      },
      fontFamily: {
        gilroy: ['GilroyRegular', "cursive"],
        gilroyBold: ["GilroyBold", "cursive"],
        gilroyExtraBold: ["GilroyExtraBold", "cursive"],
        gilroyLight: ["GilroyLight", "cursive"],
      },
    },
      plugins: [
          plugin(function({ addUtilities }) {
              addUtilities({
                  '.no-scrollbar::-webkit-scrollbar': {
                      'display': 'none',
                  },
                  '.no-scrollbar': {
                      '-ms-overflow-style': 'none',
                      'scrollbar-width': 'none'
                  },
              })
          })
      ],
  }
}
