"use client";

import { useDarkMode } from "./DarkModeProvider";

export function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={!darkMode}
                onChange={toggleDarkMode}
                className="w-6 h-6 accent-yellow-400 dark:accent-gray-700 cursor-pointer"
            />
            <span className="select-none text-gray-700 dark:text-gray-300 font-medium">{!darkMode ? "Light Mode" : "Dark Mode"}</span>
        </div>
    );
}
