# CLAUDE.md — my-web

## Skills (에이전트 호출 가이드)

반복 작업은 아래 스킬을 참조해서 처리한다. 해당 작업 감지 시 자동으로 불러온다.

| 스킬 | 트리거 | 위치 |
|------|--------|------|
| `create-glass-component` | UI 컴포넌트 생성, 글래스 카드, 배지 | `.claude/skills/create-glass-component/SKILL.md` |
| `create-page-section` | 섹션 컴포넌트, 페이지 레이아웃, hero/features | `.claude/skills/create-page-section/SKILL.md` |
| `create-api-endpoint` | FastAPI 라우터, 엔드포인트, Pydantic 스키마 | `.claude/skills/create-api-endpoint/SKILL.md` |
| `create-api-client` | Next.js fetch 클라이언트, 서버/클라이언트 데이터 호출 | `.claude/skills/create-api-client/SKILL.md` |
| `create-3d-hover` | 3D 호버, tilt 효과, framer-motion 애니메이션 | `.claude/skills/create-3d-hover/SKILL.md` |

> 에이전트는 작업 유형을 판단해 해당 스킬의 패턴/체크리스트를 따른다.

---

## Project Overview

**Trendy Linear + Apple 3D Glassmorphism 스타일의 웹 서비스**

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS → Vercel
- **Backend**: FastAPI (Python 3.11+) → 별도 서버
- **Design Concept**: Linear 다크 테마 + Apple 3D 글래스모피즘 (lightweight.info 스타일 참고)

---

## Directory Structure

```
my-web/                              # Next.js Frontend
├── app/
│   ├── (marketing)/                 # Route Group: 랜딩/마케팅 페이지
│   │   ├── page.tsx                 # / (홈)
│   │   └── layout.tsx
│   ├── (dashboard)/                 # Route Group: 인증 필요 페이지
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── api/                         # Next.js Route Handlers (BFF 레이어)
│   │   └── [...proxy]/route.ts      # FastAPI 프록시
│   ├── globals.css
│   └── layout.tsx                   # Root Layout
├── components/
│   ├── ui/                          # 기본 UI 프리미티브 (재사용)
│   │   ├── glass-card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── gradient-text.tsx
│   ├── sections/                    # 페이지 섹션 단위
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   └── cta-section.tsx
│   └── layout/
│       ├── navbar.tsx
│       └── footer.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                # fetch 래퍼 (baseURL, headers)
│   │   └── endpoints/               # 엔드포인트별 함수
│   ├── hooks/                       # Client-side 커스텀 훅
│   │   └── use-mouse-tilt.ts
│   └── utils/
│       └── cn.ts                    # clsx + twMerge 유틸
├── types/
│   └── api.ts                       # FastAPI 응답 타입 정의
├── public/
│   └── noise.svg                    # 노이즈 텍스처
├── tailwind.config.ts
├── next.config.ts
└── .env.local

my-api/                              # FastAPI Backend (별도 레포 or 모노레포)
├── app/
│   ├── main.py
│   ├── routers/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── core/
│       ├── config.py
│       └── exceptions.py
└── requirements.txt
```

---

## Design System

### Color Palette

```ts
// tailwind.config.ts theme.extend.colors
colors: {
  background: {
    DEFAULT: '#030712',    // 딥 블랙
    secondary: '#0a0f1e',  // 딥 네이비
  },
  surface: {
    DEFAULT: 'rgba(255,255,255,0.04)',
    hover:   'rgba(255,255,255,0.08)',
    border:  'rgba(255,255,255,0.10)',
  },
  accent: {
    purple: '#7c3aed',
    indigo: '#4f46e5',
    cyan:   '#06b6d4',
  },
  text: {
    primary:   '#f8fafc',
    secondary: '#94a3b8',
    muted:     '#475569',
  },
}
```

### Typography

```ts
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

| 용도 | 클래스 |
|------|--------|
| Hero 헤드라인 | `text-6xl md:text-8xl font-bold tracking-tight` |
| Section 제목 | `text-3xl md:text-5xl font-semibold` |
| Body | `text-base text-text-secondary font-light leading-relaxed` |
| Caption | `text-sm text-text-muted tracking-wide uppercase` |

### Glassmorphism 컴포넌트 규칙

**GlassCard** 기반 클래스:
```tsx
// components/ui/glass-card.tsx
const intensityMap = {
  low:    'bg-white/5  backdrop-blur-sm  border-white/5',
  medium: 'bg-white/8  backdrop-blur-md  border-white/8',
  high:   'bg-white/12 backdrop-blur-xl  border-white/12',
}
```
- `backdrop-blur` 중첩 금지 — 내부 자식 요소에 blur 재적용 금지
- 테두리: `border border-white/8` 고정 — 불투명 테두리 사용 금지
- 배경색: `rgba` 또는 `bg-white/[N]` 투명도 형태 유지

**Gradient Text:**
```tsx
'bg-gradient-to-r from-accent-purple via-accent-indigo to-accent-cyan bg-clip-text text-transparent'
```

**Grid/Noise Background** (Root layout 전역 적용):
```css
/* globals.css */
.bg-grid {
  background-image: url('/noise.svg'),
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: auto, 48px 48px, 48px 48px;
}
```

### 3D Hover Effect 패턴

CSS transform 우선, 복잡한 시퀀스에만 framer-motion 사용.

**CSS (기본):**
```css
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}
.card-3d:hover {
  transform: perspective(1000px) rotateX(4deg) rotateY(-4deg) translateZ(8px);
}
```

**Framer Motion (인터랙티브):**
```tsx
// lib/hooks/use-mouse-tilt.ts
export function useMouseTilt(strength = 15) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    rotateX.set(-y * strength)
    rotateY.set( x * strength)
  }
  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0) }
  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}
```
- `will-change: transform` hover 시에만 적용
- `prefers-reduced-motion` 미디어 쿼리 반드시 존중

---

## Coding Conventions

### Naming

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일/폴더 | kebab-case | `glass-card.tsx` |
| 컴포넌트 | PascalCase | `GlassCard` |
| 함수/변수 | camelCase | `fetchUserData` |
| 타입/인터페이스 | PascalCase | `ApiResponse<T>` |
| 상수 | SCREAMING_SNAKE | `API_BASE_URL` |

### TypeScript

- `strict: true` 필수 — 비활성화 금지
- `any` 사용 금지 — `unknown` + type narrowing 사용
- `enum` 금지 → `as const` 객체로 대체
  ```ts
  const ROLE = { ADMIN: 'admin', USER: 'user' } as const
  type Role = typeof ROLE[keyof typeof ROLE]
  ```
- Non-null assertion (`!`) 금지 — optional chaining + early return 사용
- 공유 타입 → `types/`, 컴포넌트 Props → 같은 파일 상단 정의

### Tailwind CSS

- 조건부 클래스 결합 시 반드시 `cn()` 사용 — 문자열 직접 연산 금지
- 인라인 `style` 속성 금지 — Tailwind 클래스 또는 CSS variables 사용
- 반복 클래스 조합은 컴포넌트로 추출
- 반응형 순서: `sm:` → `md:` → `lg:` → `xl:`

---

## API Communication Pattern

- **Server Component** → FastAPI 직접 호출 (서버 간 통신, 토큰 노출 없음)
- **Client Component** → Next.js `/api` Route Handler 경유 (BFF)
- 민감한 헤더(Authorization)는 절대 클라이언트에 노출 금지

### API Client

```ts
// lib/api/client.ts
const API_BASE_URL = process.env.FASTAPI_URL

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
```

### 캐싱 전략

```ts
fetch(url, { next: { revalidate: 60 } })  // ISR
fetch(url, { cache: 'no-store' })          // 동적 데이터
```

---

## Component Pattern

### Server vs Client

```
필요한가? → useState / useEffect / 이벤트 핸들러 / 브라우저 API
  YES → 'use client'
  NO  → Server Component (기본값)
```

- Server Component가 데이터 페칭 담당, data를 props로 Client에 전달
- `'use client'` 지시어는 파일 최상단 첫 줄
- barrel export (`index.ts`)는 `components/ui/` 단계까지만 허용

---

## FastAPI Rules

### Router Structure

```
app/
  main.py
  routers/        # APIRouter(prefix="/v1/...", tags=[...])
  models/         # SQLAlchemy ORM 모델
  schemas/        # Pydantic 요청/응답 스키마 (models와 분리)
  services/       # 비즈니스 로직
  core/
    config.py
    exceptions.py
```

### 규칙

- 응답 모델 반드시 `response_model` 파라미터로 명시
- 에러는 `HTTPException`으로 명시적 raise — silent catch 금지
- 에러 응답 구조 통일: `{ "error": { "code": "...", "message": "..." } }`
- 환경 변수는 `pydantic-settings`의 `BaseSettings`로 검증

---

## State Management

| 범위 | 도구 |
|------|------|
| URL 상태 (필터, 탭) | `useSearchParams` + `useRouter` |
| 컴포넌트 로컬 상태 | `useState` |
| 서버 데이터 캐싱 | Next.js `fetch` 캐시 |
| 전역 클라이언트 상태 | Zustand (필요 시에만) |
| 폼 상태 | React Hook Form |

- 전역 상태 최소화 — URL이나 Server Cache로 먼저 해결
- 서버 데이터를 클라이언트 store에 동기화 금지 (중복 출처)
- 불변성 필수 — 직접 객체 수정 금지

---

## Environment Variables

```bash
# .env.local (git 제외 필수)
FASTAPI_URL=http://localhost:8000       # 서버 전용
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 클라이언트 노출 허용
```

- `NEXT_PUBLIC_` 접두사 → 클라이언트 번들 포함. 시크릿 절대 금지
- `.env.example`에 키 목록만 커밋 (값 없이)
- Next.js: `src/env.ts`에서 `zod`로 런타임 검증

---

## Performance Rules

- 이미지: `next/image` 필수, `priority`는 LCP 이미지에만
- 폰트: `next/font` 사용 — 외부 `<link>` 태그 금지
- 폴드 아래 컴포넌트: `dynamic(() => import(...), { loading: () => <Skeleton /> })`
- `useEffect` 내 데이터 fetch 금지 — Server Component 사용
- framer-motion: `LazyMotion` + `domAnimation`으로 번들 분할

---

## Accessibility

- 모든 이미지 `alt` 필수 (장식용은 `alt=""`)
- 인터랙티브 요소는 시맨틱 태그 사용 — `<div onClick>` 금지
- 포커스 링 제거 금지 — 커스텀 스타일로 대체
  ```css
  :focus-visible { outline: 2px solid rgba(255,255,255,0.5); outline-offset: 2px; }
  ```
- 아이콘 버튼: `aria-label` 필수
- 텍스트 명도 대비: WCAG AA (4.5:1) 이상

---

## Git Branch Strategy

```
main            # 프로덕션 — 직접 push 금지
└── develop     # 통합 브랜치
    ├── feat/[kebab-case]
    ├── fix/[kebab-case]
    ├── refactor/[kebab-case]
    └── chore/[kebab-case]
```

- 커밋 메시지: 한국어 명령형 (`기능 추가`, `버그 수정`)
- 브랜치명: kebab-case 필수 (`feat/glass-card-component`)
- 스쿼시 머지 권장 — 히스토리 선형 유지
