import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomeLayout = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <nav className="flex h-[72px] items-center justify-between border-b border-gray-800 px-6">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer text-3xl font-extrabold text-pink-500"
        >
          돌려돌려LP판
        </h1>

        <div className="flex items-center gap-3">
          {accessToken ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/mypage")}
                className="rounded border border-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                마이페이지
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded border border-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                로그인
              </button>

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 px-6 py-8 text-gray-400">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 text-sm">
          <h2 className="text-lg font-bold text-pink-500">돌려돌려LP판</h2>

          <p className="text-gray-500">
            LP와 음악을 좋아하는 사람들을 위한 서비스
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-500">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>

          <p className="pt-2 text-xs text-gray-600">
            © 2026 돌려돌려LP판. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;