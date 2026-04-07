import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
  { to: "/movies/now_playing", label: "상영 중" },
];

export const Navbar = () => {
  return (
    <div className="bg-[#dda5e3] flex gap-3 p-4">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `text-white px-3 py-2 rounded-md ${
              isActive ? "bg-[#c990d0]" : "hover:bg-[#c990d0]"
            } transition-all duration-300`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};