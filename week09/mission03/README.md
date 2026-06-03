# 🛒 Noir — 음반 장바구니 (Zustand)

Mission 02와 동일한 기능을 Redux Toolkit 대신 **Zustand**로 재구현한 서비스입니다.  
하나의 Zustand Store 안에 장바구니 상태와 모달 상태를 함께 관리합니다.

---

## 주요 기능

### 장바구니
- 음반 목록 카드 렌더링 (썸네일, 제목, 아티스트, 가격)
- 수량 증가 / 감소 버튼
  - 수량이 1일 때 `-` 버튼을 누르면 해당 아이템 자동 삭제
  - `✕` 버튼으로도 개별 삭제 가능
- 전체 삭제 버튼 → 확인 모달 열기
- 장바구니가 비어있을 때 빈 상태 화면 표시

### 확인 모달
- "정말 삭제하시겠습니까?" 모달 팝업
- **아니요** — 모달만 닫힘
- **네** — 전체 삭제 후 모달 닫힘

### 합계 계산
- 총 수량 및 총 금액 실시간 자동 계산

### 네비게이션 바
- 브랜드명 "Noir" 표시
- 현재 장바구니 총 수량 실시간 반영

---

## ✨ 이번 주에 작업한 내용

### Mission 03 — Redux → Zustand 전환

Mission 02(Redux Toolkit) 구현을 Zustand 스타일로 전면 재설계했다.  
Redux의 Slice/Reducer/Action 패턴과 Zustand의 `create()` 패턴을 직접 비교·체험했다.

- **`useCartStore` 단일 Store**에 장바구니 + 모달 상태를 함께 정의
  - 상태: `cartItems`, `amount`, `total`, `isOpen`
  - 액션: `increase` / `decrease` / `removeItem` / `clearCart` / `calculateTotals` / `openModal` / `closeModal`
- **`set((state) => ...)` 패턴**으로 불변 상태 업데이트 (Immer 없이)
- **컴포넌트 변경사항**
  - `useSelector` / `useDispatch` / `dispatch()` 제거
  - `const { items, increase } = useCartStore()` 구조 분해 할당으로 대체
- **Redux 관련 파일 전부 제거**
  - `features/cart/cartSlice.ts`, `features/modal/modalSlice.ts`
  - `store/store.ts`, `hooks/useAppDispatch.ts`, `hooks/useAppSelector.ts`
  - `main.tsx`에서 `<Provider>` 제거 — Zustand는 Provider 불필요

| 항목 | Redux Toolkit | Zustand |
|------|--------------|---------|
| 상태 정의 | `createSlice` + 별도 파일 | `create()` 하나에 전부 |
| 액션 호출 | `dispatch(action())` | 함수 직접 호출 |
| 상태 읽기 | `useSelector` | `useCartStore()` 구조 분해 |
| Provider | 필요 | 불필요 |

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite |
| 스타일 | Tailwind CSS v4 |
| 전역 상태 | Zustand v5 |

---

## 폴더 구조

```
src/
├── components/     # Navbar, CartList, CartItem, CartTotals, Modal
├── constants/      # cartItems.ts (Mock 데이터 + CartItem 타입)
└── store/          # useCartStore.ts (단일 Zustand Store)
```

---

## 시작하기

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev
```
