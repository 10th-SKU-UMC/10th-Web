import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error("사용자 정보 조회 실패", error);
        setError("내 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-5">
        {data?.data?.avatar ? (
          <img
            src={data.data.avatar}
            alt={`${data.data.name} 프로필 이미지`}
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
            {data?.data?.name?.charAt(0) ?? "?"}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            {data?.data?.name}님 환영합니다.
          </h1>
          <p className="text-sm text-gray-500 mt-1">{data?.data?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
