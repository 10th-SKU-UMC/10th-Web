import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarNav = ({ onClose }: { onClose?: () => void }) => {
  const { isAuthenticated, logout } = useAuth();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-blue-50 text-blue-500"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const handleDeleteConfirm = () => {
    deleteAccount(undefined, {
      onSuccess: async () => {
        await logout();
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <>
      {/* 탈퇴 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-80">
            <h2 className="text-lg font-bold text-gray-900 text-center">정말 탈퇴하시겠습니까?</h2>
            <p className="text-sm text-gray-500 text-center">
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                아니오
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "처리 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 p-3 flex-1" onClick={onClose}>
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

      {isAuthenticated && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="w-full px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-center"
          >
            탈퇴하기
          </button>
        </div>
      )}
    </>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 클린업: 컴포넌트 언마운트 또는 의존성 변경 시 이벤트 리스너 해제 → 메모리 누수 방지
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-gray-200 bg-white overflow-hidden transition-[width] duration-300 ${
          isOpen ? "w-56" : "w-0"
        }`}
      >
        <SidebarNav />
      </aside>
    </>
  );
};

export default Sidebar;
