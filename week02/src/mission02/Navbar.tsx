import { clsx } from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";
import ThemeToggleButton from "./context/ThemeToggleButton";

export default function Navbar() {
  const { theme } = useTheme();
    const isLightMode = theme === THEME.LIGHT;
  return (
    <nav className = {clsx(
      'p-4 w-full flex items-center justify-end',
      {
        'bg-white text-black': isLightMode,
        'bg-black text-white': !isLightMode,
      }
    )}>
      <ThemeToggleButton />
    </nav>
  );
}