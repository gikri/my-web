# Handoff

## 프로젝트 개요
- **경로**: `/Users/gikri/Documents/main_folder/my-web`
- **스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS → Vercel / FastAPI (Python 3.11+) → 별도 서버
- **목적**: Linear 다크 테마 + Apple 3D 글래스모피즘 스타일 포트폴리오/개인 브랜드 사이트
- **디자인 레퍼런스**: lightweight.info/en 스타일, Syne 디스플레이 폰트 + DM Sans 본문

---

## 시도한 것
1. CLAUDE.md 작성 (프로젝트 아키텍처, 디자인 시스템, 코딩 컨벤션)
2. 프로젝트 레벨 스킬 5개 생성 (`.claude/skills/`)
3. 글로벌 설정: Plan 모드 시 Opus ↔ Sonnet 자동 전환 훅
4. 글로벌 설정: `/before-log` + Stop 훅 기반 세션 핸드오프 자동화
5. `/auto` 권한 위임 시스템 (auto-mode-on/off 스크립트)
6. Next.js 프로젝트 초기화 및 포트폴리오 사이트 구축

---

## 성공한 것

### 글로벌 Claude 설정 (`~/.claude/`)
- `settings.json` — `PostToolUse` 훅: `EnterPlanMode` → Opus 전환, `ExitPlanMode` → Sonnet 전환 + handoff-pending 기록
- `settings.json` — `Stop` 훅: `handoff-stop.sh` 실행 (핸드오프 배너 + auto 모드 권한 복원)
- `commands/auto.md` — `/auto` 실행 시 `auto-mode-on.sh` 호출하여 `Bash(*)` 전체 허용 + 위험 22개 deny
- `commands/before-log.md` — 피처명 추출 + `handoff-pending` 기록 + `/clear` 안내 포함
- `scripts/switch-to-opus.sh` / `switch-to-sonnet.sh` — model 전환 + plan-mode 상태 파일 관리
- `scripts/handoff-stop.sh` — Stop 훅: handoff 배너 출력 + auto 모드 백업 복원
- `scripts/auto-mode-on.sh` / `auto-mode-off.sh` — settings.local.json 동적 교체

### 프로젝트 스킬 (`.claude/skills/`)
- `create-glass-component` — 글래스모피즘 UI 컴포넌트 패턴
- `create-page-section` — Server/Client 분리 섹션 패턴
- `create-api-endpoint` — FastAPI 라우터 + Pydantic 스키마 패턴
- `create-api-client` — Next.js fetch 클라이언트 + BFF 패턴
- `create-3d-hover` — framer-motion 3D 틸트 훅 패턴

### 포트폴리오 사이트 (`/Users/gikri/Documents/main_folder/my-web`)
- `app/layout.tsx` — Syne + DM Sans 폰트, 다크 배경, bg-grid 적용
- `app/globals.css` — 글래스모피즘, gradient-text, bg-grid, 스크롤바 커스텀
- `app/page.tsx` — 전체 페이지 조립
- `tailwind.config.ts` — 커스텀 컬러 토큰, 애니메이션 키프레임
- `components/ui/glass-card.tsx` — intensity + tilt 지원 글래스 카드
- `components/ui/badge.tsx` / `button.tsx` — 재사용 UI 프리미티브
- `components/layout/navbar.tsx` — 스크롤 감지 플로팅 네비게이션
- `components/layout/footer.tsx`
- `components/sections/hero-section.tsx` — 풀스크린, 플로팅 tech 카드, 스크롤 인디케이터
- `components/sections/about-section.tsx` — 프로필 + 스탯 카드
- `components/sections/projects-section.tsx` — 6개 3D 틸트 프로젝트 카드
- `components/sections/skills-section.tsx` — 3카테고리 기술 배지 그리드
- `components/sections/contact-section.tsx` — 글래스 폼 + 소셜 링크
- `lib/hooks/use-mouse-tilt.ts` — framer-motion useSpring 3D 훅
- `lib/utils/cn.ts` — clsx + twMerge 유틸
- `types/index.ts` — Project, Skill 타입
- TypeScript 에러 0개, `http://localhost:3000` 정상 응답

---

## 실패한 것
- **Firecrawl 미인증**: lightweight.info 스크래핑 불가 → WebFetch로 대체 시도했으나 사용자 거절 → 참고 없이 구현
- **handoff 훅 자동 트리거 한계**: `EnterPlanMode`/`ExitPlanMode` 도구 미사용 시 자동 감지 불가 (대화 기반 전환은 감지 안 됨)

---

## 다음 단계

1. **콘텐츠 개인화**: `gikri` 이름, 프로젝트 내용, 소셜 링크 실제 정보로 교체
2. **FastAPI 백엔드 셋업**: `my-api/` 디렉토리 구조 생성, contact 폼 API 연결
3. **이미지 최적화**: `next/image`로 프로젝트 스크린샷 추가
4. **다크/라이트 모드**: 현재 다크 전용 → 시스템 테마 대응 검토
5. **SEO 메타데이터**: `app/layout.tsx` OpenGraph, Twitter Card 추가
6. **Vercel 배포**: 환경변수 설정 후 배포
7. **`.env.local` 생성**: `FASTAPI_URL`, `NEXT_PUBLIC_APP_URL` 실제값 설정
8. **애니메이션 폴리싱**: 섹션 간 전환 애니메이션, 커서 커스텀 검토

---

## 참고 사항

- **개발 서버**: `npm run dev` → `http://localhost:3000` (현재 백그라운드 실행 중일 수 있음)
- **폰트**: Syne (display, `var(--font-syne)`) + DM Sans (body, `var(--font-dm-sans)`) — next/font/google으로 로드
- **글래스카드 주의**: `backdrop-blur` 중첩 금지, 내부 자식에 blur 재적용 시 성능 저하
- **auto 모드**: `/auto` 실행 시 `settings.local.backup.json` 생성됨 — Stop 훅이 자동 복원하므로 수동 삭제 불필요
- **모델 전환**: `EnterPlanMode` → Opus, `ExitPlanMode` → Sonnet (settings.json의 `model` 필드 업데이트, 다음 세션부터 적용)
- **의존성**: `framer-motion`, `clsx`, `tailwind-merge`, `lucide-react` 설치 완료

---
## 재개 명령어
/resume portfolio-site
