// frontend/tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          // Add this EXACT configuration
          'math-blue': {
            DEFAULT: '#2563eb',
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb', // Your primary color
            700: '#1d4ed8',
          },
          'math-pi': '#3b82f6', // Simple format also works
        }
      },
    },
    plugins: [],
  }