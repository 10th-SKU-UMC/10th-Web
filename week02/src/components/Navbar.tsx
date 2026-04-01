import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6">
      <p className="text-xl font-bold dark:text-white">To Do List</p>
      <button
        onClick={toggleTheme}
        className="rounded-full w-10 h-10 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl"
      >
        {isDark ? "🌞" : "🌙"}
      </button>
    </nav>
  );
};

export default Navbar;
