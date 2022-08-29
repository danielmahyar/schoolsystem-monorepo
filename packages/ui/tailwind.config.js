module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                "primary": {
                    "DEFAULT": "#5465FF"
                },
                "secondary": {
                    "DEFAULT": "#306FAA"
                },
                "highlight": {
                    "DEFAULT": "#FFBF00"
                },
                "background": {
                    "DEFAULT": "#7F8DA1"
                },
                "success": {
                    "DEFAULT": "#08AA58"
                },
                "danger": {
                    "DEFAULT": "#F13B1F"
                },
                "warning": {
                    "DEFAULT": "#FFCA00"
                },
                "dark": {
                    "DEFAULT": "#333840"
                },
                "input-border": {
                    "DEFAULT": "#E5E8EC"
                }
            }
        },
    },
    plugins: [],
}