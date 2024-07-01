import { useState, useEffect } from 'react';
import { SiRetroarch } from 'react-icons/si';
import { IoSunny, IoMoon } from 'react-icons/io5';

const ThemeSelector = () => {
    const [theme, setTheme] = useState([]);

    if (typeof window !== "undefined") {
        useEffect(() => {
            const savedTheme = localStorage.getItem("theme");
            setTheme(savedTheme || "light");
        }, []);
    }

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        if (typeof window !== "undefined") {
            theme = selectedTheme;
            var r = document.querySelector(':root');
            document.body.classList.remove('darkmode', 'retro');

            const mainMenuItems = document.querySelectorAll('.main_menu_item');
            mainMenuItems.forEach(item => {
                item.classList.remove('main_menu_item_dark');
            });

            if (theme === 'dark') {
                r.style.setProperty('--secondary-color', '#1f1f1f');
                r.style.setProperty('--primary-color', '#f9f9f9');
                r.style.setProperty('--primary-color-hover', '#e7e7e7');
                r.style.setProperty('--secondary-color-hover', '#0e0e0e');

                localStorage.setItem("theme", "dark");
            } else if (theme === 'retro') {
                localStorage.setItem("theme", "retro");
                document.body.classList.add('retro');
            } else {
                r.style.setProperty('--secondary-color', '#f9f9f9');
                r.style.setProperty('--primary-color', '#1f1f1f');
                r.style.setProperty('--primary-color-hover', '#0e0e0e');
                r.style.setProperty('--secondary-color-hover', '#e7e7e7');

                localStorage.setItem("theme", "light");
            }
        }
    };

    return (
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioRetro"
                autoComplete="off"
                checked={theme === 'retro'}
                onChange={() => handleThemeChange('retro')}
            />
            <label className="btn btn-custom" htmlFor="radioRetro" title="Retro Mode">
                <SiRetroarch />
            </label>

            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioLight"
                autoComplete="off"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
            />
            <label className="btn btn-custom" htmlFor="radioLight" title="Light Mode">
                <IoSunny />
            </label>

            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioDark"
                autoComplete="off"
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
            />
            <label className="btn btn-custom" htmlFor="radioDark" title="Dark Mode">
                <IoMoon />
            </label>
        </div>
    );
};

export default ThemeSelector;
