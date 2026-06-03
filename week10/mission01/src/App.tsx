import { useState } from 'react';
import type { FormEvent } from 'react';
import SearchForm from './components/SearchForm';
import type { Language, SearchParams } from './types/movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<Language>('ko-KR');

  // 실제 API 호출에 사용될 확정된 검색 파라미터 (검색 버튼 클릭 시 업데이트)
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query: query.trim(), includeAdult, language });
  };

  console.log('App 렌더링', searchParams);

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* 헤더 */}
        <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          🎬 Movie Search
        </h1>

        {/* 검색 폼 */}
        <SearchForm
          query={query}
          includeAdult={includeAdult}
          language={language}
          onQueryChange={setQuery}
          onAdultChange={setIncludeAdult}
          onLanguageChange={setLanguage}
          onSubmit={handleSubmit}
        />

        {/* 검색 결과 영역 — 2번 체크리스트에서 구현 */}
        {searchParams && (
          <p className="mt-8 text-center text-sm text-gray-500">
            "{searchParams.query}" 검색 결과 (추후 구현)
          </p>
        )}
      </div>
    </div>
  );
}
