import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-gray-50 gap-6 text-center px-4">
      <p className="text-8xl font-bold text-blue-500">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
        <p className="text-gray-400 text-sm">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
      </div>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
