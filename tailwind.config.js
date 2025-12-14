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
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
            animation: {
                blob: "blob 7s infinite",
            },
        },
    },
    plugins: [],
}
