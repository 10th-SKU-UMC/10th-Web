import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="rounded bg-pink-500 px-6 py-3 text-white hover:bg-pink-600 transition-colors"
      >
        로그인 페이지 가기
      </button>
    </div>
  );
}