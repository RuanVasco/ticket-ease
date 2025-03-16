import { useState, useEffect } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";

import ThemeChange from "./ThemeChange";
import "../assets/styles/theme_selector.css";

const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }
    }, []);

    useEffect(() => {
        ThemeChange(theme);
    }, [theme]);

    const handleThemeChange = (selectedTheme: string) => {
        setTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    };

    return (
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioLight"
                autoComplete="off"
                checked={theme !== "retro" && theme !== "dark"}
                onChange={() => handleThemeChange("light")}
            />
            <label className="btn btn-theme-selector" htmlFor="radioLight" title="Light Mode">
                <IoSunny />
            </label>

            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioDark"
                autoComplete="off"
                checked={theme === "dark"}
                onChange={() => handleThemeChange("dark")}
            />
            <label className="btn btn-theme-selector" htmlFor="radioDark" title="Dark Mode">
                <IoMoon />
            </label>
        </div>
    );
};

export default ThemeSelector;
