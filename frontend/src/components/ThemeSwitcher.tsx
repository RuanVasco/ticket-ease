import { IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import "../assets/styles/theme_selector.css";

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioLight"
                autoComplete="off"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
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
                onChange={() => setTheme("dark")}
            />
            <label className="btn btn-theme-selector" htmlFor="radioDark" title="Dark Mode">
                <IoMoon />
            </label>
        </div>
    );
};

export default ThemeSwitcher;
