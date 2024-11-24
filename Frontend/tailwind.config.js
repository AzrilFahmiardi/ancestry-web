/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"]
      },
      backgroundImage: {
        "blue-black-gradient": "linear-gradient(to bottom, #000000 30%, #001233 100%)",
        "green-gradient": "linear-gradient(to bottom, #A9D6E5 0%, #5E777F 100%)",
        "green-gradient-2": "linear-gradient(to bottom, #A9D6E5 100%, #5E777F 100%)",
        "green-gradient-3": "linear-gradient(to bottom, #CAF0F8 0%, #000000 100%)",
        
      },
    },
  },
  plugins: [],
}