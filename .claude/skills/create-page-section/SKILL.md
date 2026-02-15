# create-page-section

Next.js App Router 페이지 섹션 컴포넌트를 생성한다.

## Trigger

사용자가 다음을 요청할 때 자동 사용:
- "섹션 만들어", "hero 섹션", "features 섹션"
- `app/` 하위에 새 페이지 또는 섹션 추가 시
- Server/Client 컴포넌트 분리가 필요한 경우

## Rules

1. 파일 위치: `components/sections/[name]-section.tsx`
2. 섹션은 기본적으로 **Server Component** (데이터 페칭 담당)
3. 애니메이션/인터랙션이 필요한 자식은 별도 Client 컴포넌트로 분리
4. 컴포넌트명: `[Name]Section` (PascalCase)

## Server/Client 결정 기준

```
필요한가? → useState / useEffect / 이벤트 핸들러 / 브라우저 API / framer-motion
  YES → 'use client' 추가
  NO  → Server Component (기본값, 지시어 없음)
```

## Server Section 패턴 (기본)

```tsx
// components/sections/features-section.tsx
import { GlassCard } from '@/components/ui/glass-card'

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold text-slate-100 mb-4">
          제목
        </h2>
        <p className="text-slate-400 font-light leading-relaxed mb-16">
          설명
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 카드 목록 */}
        </div>
      </div>
    </section>
  )
}
```

## Server + Client 분리 패턴 (데이터 + 애니메이션)

```tsx
// components/sections/hero-section.tsx (Server)
import { HeroClient } from '@/components/sections/hero-client'

async function getHeroData() {
  // 서버에서 데이터 페칭
}

export async function HeroSection() {
  const data = await getHeroData()
  return <HeroClient data={data} />
}

// components/sections/hero-client.tsx (Client)
'use client'
import { motion } from 'framer-motion'

interface HeroClientProps {
  data: HeroData
}

export function HeroClient({ data }: HeroClientProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* 인터랙티브 콘텐츠 */}
    </motion.section>
  )
}
```

## Hero 섹션 레이아웃

```tsx
<section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
  {/* 배경 효과 */}
  <div className="absolute inset-0 bg-grid pointer-events-none" />
  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

  {/* 콘텐츠 */}
  <div className="relative z-10 max-w-4xl mx-auto">
    {/* Badge */}
    {/* Headline */}
    {/* Subtext */}
    {/* CTA Buttons */}
  </div>
</section>
```

## Typography Scale

| 용도 | 클래스 |
|------|--------|
| Hero 헤드라인 | `text-6xl md:text-8xl font-bold tracking-tight text-slate-100` |
| Section 제목 | `text-3xl md:text-5xl font-semibold text-slate-100` |
| Body | `text-base text-slate-400 font-light leading-relaxed` |
| Caption | `text-sm text-slate-500 tracking-wide uppercase` |

## Checklist

- [ ] Server Component 기본 — `'use client'` 최소화
- [ ] 데이터 페칭은 Server에서, 인터랙션은 Client에서
- [ ] 배경 효과 (`bg-grid`, glow) 적용
- [ ] 반응형 타이포그래피 (`text-4xl md:text-6xl`)
- [ ] `max-w-*` + `mx-auto` + `px-4` 레이아웃 패턴
