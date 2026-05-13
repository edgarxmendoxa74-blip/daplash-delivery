/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#0ea5e9', // Sky Blue primary
                    secondary: '#0284c7', // Sky Blue darker
                    light: '#ffffff', // White
                    accent: '#eab308', // Yellow
                    peach: '#fef08a', // Light Yellow
                    charcoal: '#111827', // For text
                },
                green: { // Keeping the object name to prevent class breakage, mapping to sky blue
                    primary: '#0ea5e9',
                    dark: '#0284c7',
                    light: '#38bdf8',
                    lighter: '#e0f2fe',
                    darkest: '#0c4a6e',
                },
                offwhite: {
                    DEFAULT: '#FAFAFA',
                    light: '#FFFFFF',
                }
            },
            fontFamily: {
                'brand': ['Outfit', 'system-ui', 'sans-serif'],
                'soft': ['Quicksand', 'sans-serif'],
                'outfit': ['Outfit', 'sans-serif']
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'bounce-gentle': 'bounceGentle 0.6s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                bounceGentle: {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-4px)' },
                    '60%': { transform: 'translateY(-2px)' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
            }
        },
    },
    plugins: [],
};
