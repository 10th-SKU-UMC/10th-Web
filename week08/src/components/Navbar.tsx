import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="relative sticky bg-white fixed top-0 left-0 w-full h-[60px] p-5 shadow-md z-50">
      <div className="flex flex-row justify-center w-full gap-5 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          Debounce
        </NavLink>

        <NavLink
          to="/throttling"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          Throttling
        </NavLink>
      </div>
    </div>
  );
}
