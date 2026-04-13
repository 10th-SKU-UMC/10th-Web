import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("isLoggedIn") || "false");
    setIsLoggedIn(stored);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="relative sticky bg-white fixed top-0 left-0 w-full h-[60px] p-5 shadow-md z-50">
      <div className="flex flex-row justify-center w-full gap-5 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          홈
        </NavLink>

        <NavLink
          to="/popular"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          인기 영화
        </NavLink>

        <NavLink
          to="/now-playing"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          상영 중
        </NavLink>

        <NavLink
          to="/top-rated"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          평점 높은
        </NavLink>

        <NavLink
          to="/upcoming"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "text-black"
          }
        >
          개봉 예정
        </NavLink>
      </div>

      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-3">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              마이페이지
            </NavLink>

            <button
              onClick={handleLogout}
              className="text-black cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              로그인
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              회원가입
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
