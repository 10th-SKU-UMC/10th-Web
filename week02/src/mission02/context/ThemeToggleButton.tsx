import { THEME, useTheme } from "./ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
    const {theme, toggleTheme} = useTheme();
    const isLightMode = theme === THEME.LIGHT;
  return (
    <button onClick={toggleTheme} > 
        {isLightMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button >
  )
}
