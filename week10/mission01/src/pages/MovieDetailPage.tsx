import { useParams, useNavigate } from 'react-router-dom';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1e] text-white">
      <p className="mb-2 text-gray-400 text-sm">영화 ID</p>
      <p className="mb-8 text-2xl font-bold text-violet-400">{movieId}</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
      >
        검색으로 돌아가기
      </button>
    </div>
  );
}
