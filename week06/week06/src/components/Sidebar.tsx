import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarNav = ({ onClose }: { onClose?: () => void }) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-blue-50 text-blue-500"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="flex flex-col gap-1 p-3" onClick={onClose}>
      <Link to="/" className={linkClass("/")}>
        홈
      </Link>
      {isAuthenticated ? (
        <Link to="/my" className={linkClass("/my")}>
          마이페이지
        </Link>
      ) : (
        <>
          <Link to="/login" className={linkClass("/login")}>
            로그인
          </Link>
          <Link to="/signup" className={linkClass("/signup")}>
            회원가입
          </Link>
        </>
      )}
    </nav>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* 모바일 오버레이 사이드바 */}
      <div className={`fixed inset-0 z-40 md:hidden ${isOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-56 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarNav onClose={onClose} />
        </aside>
      </div>

      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white">
        <SidebarNav />
      </aside>
    </>
  );
};

export default Sidebar;
