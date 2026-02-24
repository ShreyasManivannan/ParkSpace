
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Initialize theme based on localStorage or system preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? (
                <Sun className="w-4 h-4 text-yellow-400 group-hover:rotate-90 transition-transform" />
            ) : (
                <Moon className="w-4 h-4 text-primary-500 group-hover:-rotate-12 transition-transform" />
            )}
        </button>
    );
}
