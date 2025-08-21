"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedDarkMode = localStorage.getItem("darkMode");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (storedDarkMode !== null) {
            setDarkMode(storedDarkMode === "true");
        } else {
            setDarkMode(systemPrefersDark);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("darkMode", darkMode.toString());
        }
    }, [darkMode, mounted]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
}
