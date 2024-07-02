import { useState, useEffect } from 'react';
import { SiRetroarch } from 'react-icons/si';
import { IoSunny, IoMoon } from 'react-icons/io5';
import ThemeChange from './ThemeChange';

const ThemeSelector = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (theme) => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
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
                checked={theme !== 'retro' && theme !== 'dark'}
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
