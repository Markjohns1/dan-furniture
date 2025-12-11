/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef7ee',
                    100: '#fdedd6',
                    200: '#fad7ac',
                    300: '#f6bb77',
                    400: '#f19440',
                    500: '#ed7a1a',
                    600: '#de6010',
                    700: '#b84810',
                    800: '#933a15',
                    900: '#773214',
                    950: '#401708',
                },
                secondary: {
                    50: '#f6f5f5',
                    100: '#e7e5e4',
                    200: '#d1cdcc',
                    300: '#b1aba8',
                    400: '#8a817e',
                    500: '#6f6663',
                    600: '#5e5553',
                    700: '#4e4746',
                    800: '#443f3e',
                    900: '#3b3736',
                    950: '#211e1e',
                },
                accent: {
                    50: '#f0fdf6',
                    100: '#dcfcea',
                    200: '#bbf7d6',
                    300: '#86efb7',
                    400: '#4ade8f',
                    500: '#22c56b',
                    600: '#16a355',
                    700: '#158046',
                    800: '#16653a',
                    900: '#145332',
                    950: '#052e19',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'bounce-light': 'bounceLight 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceLight: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                }
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
