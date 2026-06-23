# 🎬 Movie Search — TMDB 영화 검색

TMDB API를 활용한 영화 검색 서비스입니다.  
검색어, 성인 콘텐츠 포함 여부, 언어를 선택해 영화를 검색하고, 카드를 클릭하면 상세 정보 모달을 확인할 수 있습니다.

---

## 주요 기능

### 영화 검색
- 영화 제목 입력 후 검색하기 버튼 또는 엔터로 검색
- 성인 콘텐츠 포함 여부 체크박스 (TMDB `include_adult` 파라미터 연동)
- 언어 선택 — 한국어 / 영어 / 일본어
- 검색 결과 없음 / 로딩 / 에러 상태 처리

### 영화 카드 그리드
- 2 / 3 / 4 컬럼 반응형 그리드
- 포스터 이미지, 평점 배지(색상으로 등급 구분), 제목, 개봉일, 줄거리 표시

### 영화 상세 모달
- 카드 클릭 시 모달 팝업
- 백드롭 이미지, 한국어 제목, 원제, 평점, 개봉일, 인기도 바, 줄거리
- IMDb에서 검색 버튼 (새 탭 오픈)
- 닫기 버튼 / X 버튼 / 오버레이 클릭으로 닫기

---

## ✨ 이번 주에 작업한 내용

### Mission 01 — 렌더링 최적화

React DevTools Profiler로 불필요한 리렌더링을 측정하고, `memo` / `useCallback` / `useMemo`를 적용해 성능을 개선했다.

**최적화 전 문제**
- 글자 입력 시 App → SearchForm → MovieCard 20개 전부 리렌더
- 모달 열기/닫기 시 MovieCard와 무관한데도 전체 리렌더
- Render 시간: **16.4ms**

**최적화 후**
- 글자 입력 시 App + SearchForm만 리렌더 (MovieCard 건너뜀)
- 모달 열기/닫기 시 MovieCard 리렌더 없음
- Render 시간: **2.5ms** (약 6.5배 개선)

**적용한 최적화**

| 기법 | 적용 위치 | 효과 |
|------|-----------|------|
| `memo` | `MovieCard` | 검색 결과 데이터가 안 바뀌면 리렌더 건너뜀 |
| `memo` | `SearchForm` | `selectedMovie` 변경 시 리렌더 건너뜀 |
| `useCallback` | `handleMovieClick`, `handleModalClose`, `handleSubmit` | 함수 참조 안정화로 memo 효과 보장 |
| `useMemo` | `movies` 배열 | data 변경 없을 때 동일 배열 참조 유지 |

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite |
| 스타일 | Tailwind CSS v4 |
| 서버 상태 | TanStack Query v5 |
| HTTP | Axios |
| 영화 데이터 | TMDB API v3 |

---

## 폴더 구조

```
src/
├── api/            # movieApi.ts (TMDB axios 인스턴스)
├── components/     # SearchForm, MovieCard, MovieModal
└── types/          # movie.ts (Movie, SearchParams, Language 타입)
```

---

## 시작하기

```bash
# 패키지 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env에 VITE_TMDB_KEY 입력

# 개발 서버 실행
pnpm dev
```

---

## 환경변수

| 키 | 설명 |
|----|------|
| `VITE_TMDB_KEY` | TMDB API 키 (themoviedb.org에서 발급) |
