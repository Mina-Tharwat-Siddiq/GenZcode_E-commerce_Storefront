// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export  const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("darkMode", isDark);
    }, [isDark]);

    const toggle = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}