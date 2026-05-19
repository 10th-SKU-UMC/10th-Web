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
├── hooks/         # useAuth, useLocalStorage
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
# .env에 VITE_SERVER_URL 입력

# 개발 서버 실행
pnpm dev
```

---

## 환경변수

| 키 | 설명 |
|----|------|
| `VITE_SERVER_URL` | 백엔드 API 서버 주소 |
