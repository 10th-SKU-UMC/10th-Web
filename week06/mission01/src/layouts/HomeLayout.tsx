import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import hamburgerImg from "../assets/hamburger-button.svg";

const HomeLayout = () => {
  const navigate = useNavigate();
  const { accessToken, name, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* 사이드바 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* ── 헤더 ── */}
      <header className="flex h-[60px] shrink-0 items-center border-b border-gray-800 px-4 gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="transition hover:opacity-70"
          aria-label="메뉴"
        >
          <img src={hamburgerImg} alt="menu" className="h-7 w-7 invert" />
        </button>

        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-extrabold text-pink-500"
        >
          DOLIGO
        </h1>

        <div className="ml-auto flex items-center gap-3">
          {accessToken ? (
            <>
              <span className="text-sm text-gray-300">{name}님 반갑습니다.</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-400 transition hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-300 transition hover:text-white"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="rounded bg-pink-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* ── 딤 오버레이 ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── 사이드바 ── */}
        <aside
          ref={sidebarRef}
          className={`
            fixed top-[60px] left-0 z-30 flex h-[calc(100vh-60px)] w-[160px] flex-col
            border-r border-gray-800 bg-black transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="flex flex-1 flex-col gap-1 p-4 pt-6">
            <button
              type="button"
              onClick={() => { navigate("/"); setSidebarOpen(false); }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              찾기
            </button>

            <button
              type="button"
              onClick={() => { navigate("/mypage"); setSidebarOpen(false); }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              마이페이지
            </button>
          </nav>

          <div className="p-4">
            {accessToken && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded px-3 py-2 text-left text-sm text-gray-500 transition hover:text-red-400"
              >
                탈퇴하기
              </button>
            )}
          </div>
        </aside>

        {/* ── 메인 컨텐츠 ── */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
