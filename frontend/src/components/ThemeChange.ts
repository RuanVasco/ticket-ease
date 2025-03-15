const ThemeChange = (theme: string): void => {
    if (typeof window !== "undefined") {
        const r = document.querySelector(":root") as HTMLElement;

        if (!r) return;

        if (theme === "dark") {
            r.style.setProperty("--secondary-color", "#1f1f1f");
            r.style.setProperty("--primary-color", "#f9f9f9");
            r.style.setProperty("--primary-color-hover", "#e7e7e7");
            r.style.setProperty("--secondary-color-hover", "#0e0e0e");
            localStorage.setItem("theme", "dark");
        } else if (theme === "light") {
            const mainMenuItems = document.querySelectorAll(".main_menu_item");

            mainMenuItems.forEach((item) => {
                (item as HTMLElement).classList.remove("main_menu_item_dark");
            });

            document.body.classList.remove("darkmode");
            r.style.setProperty("--secondary-color", "#f9f9f9");
            r.style.setProperty("--primary-color", "#1f1f1f");
            r.style.setProperty("--primary-color-hover", "#0e0e0e");
            r.style.setProperty("--secondary-color-hover", "#e7e7e7");
            localStorage.setItem("theme", "light");
        }
    }
};

export default ThemeChange;
