import { useState, useEffect } from 'react';
import { SiRetroarch } from 'react-icons/si';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ThemeSelector = () => {
    const [theme, setTheme] = useState('light');
    let userID = null;

    const getThemeData = (userID) => {
        axios.get(`http://localhost:8080/theme/${userID}`)
            .then(response => {
                setTheme(response.data.theme);
            })
            .catch(error => {
                console.error('Erro ao recuperar o tema:', error);
            });
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = jwtDecode(token);
                userID = decodedToken.userId;
                getThemeData(userID);
            }
        }
    }, []);

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    useEffect(() => {
        document.body.classList.remove('darkmode');
        if (theme === 'dark') {
            document.body.classList.add('darkmode');
        }

        axios.post(`http://localhost:8080/theme/${userID}`, { theme })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Erro ao atualizar o tema:', error);
            });
    }, [theme, userID]);

    return (
        <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input
                type="checkbox"
                className="btn-check"
                id="checkboxRetro"
                autoComplete="off"
                checked={theme === 'retro'}
                onChange={() => handleThemeChange('retro')}
            />
            <label className="btn btn-custom" htmlFor="checkboxRetro" title="Retro Mode">
                <SiRetroarch />
            </label>

            <input
                type="checkbox"
                className="btn-check"
                id="checkboxLight"
                autoComplete="off"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
            />
            <label className="btn btn-custom" htmlFor="checkboxLight" title="Light Mode">
                <IoSunny />
            </label>

            <input
                type="checkbox"
                className="btn-check"
                id="checkboxDark"
                autoComplete="off"
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
            />
            <label className="btn btn-custom" htmlFor="checkboxDark" title="Dark Mode">
                <IoMoon />
            </label>
        </div>
    );
};

export default ThemeSelector;
