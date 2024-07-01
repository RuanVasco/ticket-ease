
const ThemeChange = (theme) => {
    if (typeof window !== "undefined") {
        const r = document.querySelector(':root');
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
        } else {
            r.style.setProperty('--secondary-color', '#f9f9f9');
            r.style.setProperty('--primary-color', '#1f1f1f');
            r.style.setProperty('--primary-color-hover', '#0e0e0e');
            r.style.setProperty('--secondary-color-hover', '#e7e7e7');
            localStorage.removeItem("theme");
        }
    }
};

export default ThemeChange;
