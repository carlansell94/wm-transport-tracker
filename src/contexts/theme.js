import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { SettingsStorage, addSettingsListener } from "../storage/storage";

const ThemeContext = createContext();

const ThemeValueProvider = ({children}) => {
    const [theme, setTheme] = useState('system');
    const themeSetting = SettingsStorage.getString('theme');

    if (typeof themeSetting !== 'undefined') {
        const newTheme = JSON.parse(themeSetting).current;

        if (theme !== newTheme) {
            setTheme(newTheme);
        }
    }

    addSettingsListener(function cb (key) {
        if (key ==='theme') {
            setTheme(SettingsStorage.getString('theme'));
        }
    });

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

function isDarkTheme() {
    const {theme} = useContext(ThemeContext);
    const systemTheme = useColorScheme();

    if (theme === 'system') {
        return systemTheme === 'dark';
    };

    return theme === 'dark';
}

export { ThemeContext, ThemeValueProvider, isDarkTheme };