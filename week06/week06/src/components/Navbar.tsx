import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

type NavbarProps = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { isAuthenticated, isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { data: myInfo } = useGetMyInfo(isAuthenticated);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <button
        className="md:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onMenuClick}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <Link to="/" className="text-xl font-bold text-blue-500 tracking-tight">
        <small>돌려돌려</small> LP판
      </Link>
      {!isAuthLoading && (
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/my"
                className="text-sm text-gray-600 hover:text-blue-500 font-medium transition-colors"
              >
                {myInfo?.data?.name
                  ? `${myInfo.data.name}님 반갑습니다.`
                  : "마이페이지"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-500 font-medium transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
