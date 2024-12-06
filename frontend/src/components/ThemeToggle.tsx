import React, { useState, useEffect } from 'react';

export default function ThemeToggle  ()  {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <div
                        className={`
              w-14 h-7 rounded-full shadow-inner
              transition-colors duration-300
              ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-400'}
            `}
                    ></div>
                    <div
                        className={`
              absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow 
              transform transition-transform duration-300
              ${isDarkMode ? 'translate-x-full' : 'translate-x-0'}
            `}
                    >
                    </div>
                </div>
            </label>
        </div>
    );
};

