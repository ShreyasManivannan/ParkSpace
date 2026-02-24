/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    400: '#33FFB3',
                    500: '#00FFA3',
                    600: '#00CC82',
                },
                accent: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6', // Electric Purple
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                glass: {
                    DEFAULT: 'rgba(255, 255, 255, 0.05)',
                    hover: 'rgba(255, 255, 255, 0.1)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'radial-gradient(circle at top right, #1e1b4b, #020617 60%)',
                'neon-gradient': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            },
            boxShadow: {
                'neon': '0 0 20px rgba(6, 182, 212, 0.5)',
                'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
            },
            backdropBlur: {
                '3xl': '64px',
            },
        },
    },
    plugins: [],
}
