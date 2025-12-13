/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FFB040",
                secondary: "#F8A488",
                bg: "#FFFAF0",
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            },
            padding: {
                'safe': 'env(safe-area-inset-bottom)',
            },
        },
    },
    plugins: [],
}
