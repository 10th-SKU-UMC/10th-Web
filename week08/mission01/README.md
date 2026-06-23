# 🎵 DOLIGO — LP 공유 플랫폼

LP(바이닐 레코드)를 주제로 한 콘텐츠 공유 서비스입니다.  
사용자가 LP를 등록하고, 좋아요와 댓글로 소통할 수 있습니다.

---

## 주요 기능

### 인증
- 이메일/비밀번호 회원가입 및 로그인
- Google OAuth 소셜 로그인
- JWT 기반 인증 (Access Token / Refresh Token 자동 갱신)
- 로그아웃 및 회원 탈퇴 (확인 모달)

### 홈 피드
- LP 목록 무한 스크롤 (커서 기반 페이지네이션)
- 최신순 / 오래된순 정렬
- 마소너리 카드 레이아웃

### 검색
- 사이드바 "찾기" 버튼으로 검색 모달 열기
- 제목 / 태그 검색 타입 선택
- `useDebounce` 적용 — 입력 후 300ms 뒤에만 API 요청 발생
- 검색 결과 무한 스크롤
- 최근 검색어 localStorage 저장 (Enter 키 또는 결과 클릭 시 저장)

### LP
- 모달로 LP 생성 (이미지 업로드, 태그 추가/삭제, 바이닐 레코드 UI)
- 상세 조회 — 썸네일, 본문, 태그, 좋아요 수 표시
- 본인 LP 수정 (모달) / 삭제
- 좋아요 토글 — **낙관적 업데이트**로 즉시 반영

### 댓글
- 댓글 작성 / 수정 / 삭제
- 최신순 / 오래된순 정렬
- 본인 댓글만 수정·삭제 버튼 노출

### 마이페이지
- 프로필 수정 (닉네임, 자기소개, 아바타 이미지)
  - **낙관적 업데이트**로 Nav-Bar 닉네임 즉시 반영
- 내가 좋아요 한 LP / 내가 작성한 LP 탭 전환
- 오래된순 / 최신순 정렬
- 내 LP 인라인 수정 (전체 편집 모달) 및 삭제

### 사이드바
- `useSidebar` 훅으로 열림/닫힘 상태 관리 (`open` / `close` / `toggle`)
- Tailwind CSS `transition-transform duration-300` 으로 슬라이드 애니메이션
- ESC 키로 닫기 (`keydown` EventListener + useEffect cleanup)
- 사이드바 열릴 때 배경 스크롤 방지 (`document.body.style.overflow = "hidden"`)

---

## ✨ 이번 주에 작업한 내용

### Mission 01 — useDebounce

`useDebounce<T>(value, delay)` 커스텀 훅을 직접 구현했다.  
검색 입력 시 글자를 칠 때마다 API가 호출되는 문제를 해결하기 위해, 입력이 300ms 동안 멈췄을 때만 서버 요청이 발생하도록 제어했다.

- `setTimeout` + `clearTimeout` 으로 타이머를 관리하고, 의존성 변경 시 cleanup으로 이전 타이머를 제거
- 제목 / 태그 검색 타입 드롭다운 구현
- 최근 검색어는 debounce 타이밍이 아닌, **Enter 키** 또는 **결과 클릭** 시에만 저장

### Mission 02 — useThrottle

`useThrottle<T>(value, interval)` 커스텀 훅을 구현했다.  
홈 피드 무한 스크롤에 적용하여, 빠르게 스크롤해도 API 요청이 1초에 한 번만 발생하도록 제어했다.

- leading 방식: 첫 발생 시 즉시 반영하고, 이후 interval 동안 trailing 업데이트를 스케줄링
- IntersectionObserver의 `isIntersecting` 값을 throttle하여 `fetchNextPage` 호출 빈도를 제한
- Network 탭에서 요청 간격이 일정하게 유지되는 것을 확인 가능

### Mission 03 — useSidebar

사이드바 열림/닫힘 로직을 `useSidebar` 커스텀 훅으로 분리했다.

- `open()` / `close()` / `toggle()` 함수 제공
- ESC 키 이벤트 리스너를 훅 내부에서 등록하고, cleanup 함수로 해제하여 메모리 누수 방지
- 배경 스크롤 방지: `document.body.style.overflow = "hidden"` 을 `isOpen` 상태에 따라 토글

<details>
<summary>배경 스크롤 방지 — 어떻게 해결했나</summary>

사이드바가 열렸을 때 뒤 배경 콘텐츠가 스크롤되는 문제를 발견했다.  
`overflow: hidden` 이 요소의 콘텐츠 넘침을 잘라내는 CSS 속성임을 활용하여, `body` 에 적용하면 페이지 전체 스크롤이 차단된다는 점을 이용했다.  
`useSidebar` 훅의 `useEffect` 안에서 `isOpen` 이 `true` 일 때 `document.body.style.overflow = "hidden"` 으로 설정하고, 닫힐 때 `""` 로 되돌린다. cleanup 함수에서도 초기화하여 컴포넌트 언마운트 시 스크롤이 잠긴 채로 남지 않도록 처리했다.

</details>

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite |
| 스타일 | Tailwind CSS |
| 서버 상태 | TanStack Query v5 |
| 라우팅 | React Router DOM v7 |
| HTTP | Axios |

---

## 폴더 구조

```
src/
├── apis/          # API 함수 (auth, lp, user, upload)
├── components/    # 공통 컴포넌트 (LpCard, CommentSection, Modal 등)
├── context/       # AuthContext (전역 인증 상태)
├── hooks/         # useAuth, useDebounce, useThrottle, useSidebar
├── layouts/       # HomeLayout (헤더, 사이드바)
├── pages/         # HomePage, LpDetailPage, MyPage, LoginPage 등
└── constants/     # localStorage 키 상수
```

---

## 시작하기

```bash
# 패키지 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env에 VITE_SERVER_URL, VITE_TMDB_KEY 입력

# 개발 서버 실행
pnpm dev
```

---

## 환경변수

| 키 | 설명 |
|----|------|
| `VITE_SERVER_URL` | 백엔드 API 서버 주소 |
| `VITE_TMDB_KEY` | TMDB API 키 |
