import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="mb-6 text-3xl font-bold">마이페이지</h1>

        <p className="mb-8 text-gray-300">
          로그인한 사용자만 접근할 수 있는 페이지입니다.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;