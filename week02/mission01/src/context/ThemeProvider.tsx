import { createContext, useState, useContext, useEffect } from "react";
import type { PropsWithChildren } from "react";

export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

export type THEME = typeof THEME[keyof typeof THEME];

interface IThemeContext {
    theme: THEME;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<THEME>(THEME.LIGHT);

    useEffect(() => {
        document.body.style.backgroundColor = theme === THEME.LIGHT ? '#ffffff' : '#1f2937';
        document.body.style.color = theme === THEME.LIGHT ? '#000000' : '#ffffff';
        document.body.style.transition = 'background-color 0.3s, color 0.3s';
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme): THEME =>
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};