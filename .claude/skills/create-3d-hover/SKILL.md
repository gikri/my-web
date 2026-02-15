# create-3d-hover

컴포넌트에 Apple 스타일 3D 호버 효과를 추가한다.

## Trigger

사용자가 다음을 요청할 때 자동 사용:
- "3D 효과 추가해"
- "호버 애니메이션 만들어"
- "Apple 스타일 인터랙션"
- 카드/버튼에 depth/tilt 효과 필요 시

## Rules

1. CSS transform 우선 — 단순 tilt는 CSS로 처리
2. 마우스 추적 인터랙션만 framer-motion 사용
3. `prefers-reduced-motion` 반드시 존중
4. `will-change: transform` 은 hover 시에만, 기본 상태에서 제거
5. `'use client'` 필수 (브라우저 이벤트 사용)

## CSS Only (단순 tilt)

```css
/* globals.css */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}
.card-3d:hover {
  transform: perspective(1000px) rotateX(4deg) rotateY(-4deg) translateZ(8px);
}

@media (prefers-reduced-motion: reduce) {
  .card-3d:hover { transform: none; }
}
```

## useMouseTilt Hook (마우스 추적)

```ts
// lib/hooks/use-mouse-tilt.ts
'use client'
import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export function useMouseTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(rawY, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(rawX, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    rawX.set( x * strength)
    rawY.set(-y * strength)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}
```

## 컴포넌트 적용

```tsx
// components/ui/tilt-card.tsx
'use client'
import { motion } from 'framer-motion'
import { useMouseTilt } from '@/lib/hooks/use-mouse-tilt'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function TiltCard({ children, className, strength = 12 }: TiltCardProps) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt(strength)

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn(
        'rounded-2xl border border-white/8 bg-white/5 backdrop-blur-md',
        'will-change-auto hover:will-change-transform',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
```

## Glow 효과 (마우스 따라가는 빛)

```tsx
// 마우스 위치 기반 glow
const glowX = useMotionValue(50)
const glowY = useMotionValue(50)

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect()
  glowX.set(((e.clientX - rect.left) / rect.width) * 100)
  glowY.set(((e.clientY - rect.top) / rect.height) * 100)
}

// style 적용
const background = useMotionTemplate`radial-gradient(
  200px circle at ${glowX}% ${glowY}%,
  rgba(124, 58, 237, 0.15),
  transparent 80%
)`
```

## Entrance Animation (섹션 진입)

```tsx
// framer-motion stagger 패턴
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
}

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(i => (
    <motion.li key={i.id} variants={item}>...</motion.li>
  ))}
</motion.ul>
```

## Checklist

- [ ] `'use client'` 추가
- [ ] `prefers-reduced-motion` 처리
- [ ] `will-change` hover 시에만 활성화
- [ ] `useSpring` 으로 부드러운 복귀 처리
- [ ] framer-motion `LazyMotion` + `domAnimation` import 확인
