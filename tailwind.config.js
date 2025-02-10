/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans serif'],
      body: ['Poppins'],
      'poppins': 'Poppins',
    },

    extend: {
      colors: {
        'blue-primary': '#0076d7',
        'black-primary': '#111111',
        'grey-primary': '#717171',
        'white-primary': '#ffffff',
        'green': '#3fb548',
        'borderColor1': '#ededed',
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    function ({ addVariant, e }) {
      addVariant('not-placeholder-shown', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `not-placeholder-shown${separator}${className}`
          )}:not(:placeholder-shown)`
        });
      });
    },
  ],
}
