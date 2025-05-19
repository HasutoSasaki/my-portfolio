export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./app/components/**/*.{js,ts,jsx,tsx}",
        "./app/components/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lightHover: '#fcf4ff',
                darkHover: '#2a004a',
                darkTheme: '#11001F',
            },
            fontFamily: {
                Outfit: ['Outfit', 'sans-serif'],
                Ovo: ['Ovo', 'serif'],
            },
            boxShadow: {
                'black': '4px 4px 0px #000000',
                'white': '4px 4px 0px #ffffff',
            }
        }
    },
    plugins: [],
}