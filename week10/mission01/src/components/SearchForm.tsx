import type { ChangeEvent, FormEvent } from 'react';
import type { Language } from '../types/movie';

interface Props {
  query: string;
  includeAdult: boolean;
  language: Language;
  onQueryChange: (value: string) => void;
  onAdultChange: (value: boolean) => void;
  onLanguageChange: (value: Language) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const LANGUAGE_OPTIONS: { label: string; value: Language }[] = [
  { label: '한국어', value: 'ko-KR' },
  { label: '영어', value: 'en-US' },
  { label: '일본어', value: 'ja-JP' },
];

export default function SearchForm({
  query,
  includeAdult,
  language,
  onQueryChange,
  onAdultChange,
  onLanguageChange,
  onSubmit,
}: Props) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  const handleAdultChange = (e: ChangeEvent<HTMLInputElement>) => {
    onAdultChange(e.target.checked);
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value as Language);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-[#111827] p-6 shadow-xl sm:p-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 영화 제목 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
            🎬 영화 제목
          </label>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="영화 제목을 입력하세요"
            className="w-full rounded-xl bg-[#1a1a2e] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-white/10 transition focus:ring-violet-500"
          />
        </div>

        {/* 성인 콘텐츠 체크박스 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
            ⚙️ 옵션
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#1a1a2e] px-4 py-3 ring-1 ring-white/10 transition hover:ring-violet-500/50">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={handleAdultChange}
              className="h-4 w-4 cursor-pointer accent-violet-500"
            />
            <span className="text-sm text-gray-300">성인 콘텐츠 표시</span>
          </label>
        </div>

        {/* 언어 선택 */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
            🌐 언어
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full cursor-pointer rounded-xl bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-violet-500"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        disabled={!query.trim()}
        className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        🔍 검색하기
      </button>
    </form>
  );
}
