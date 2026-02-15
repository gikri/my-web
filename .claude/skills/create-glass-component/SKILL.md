# create-glass-component

글래스모피즘 UI 컴포넌트를 생성한다.

## Trigger

사용자가 다음을 요청할 때 자동 사용:
- "카드 컴포넌트 만들어"
- "글래스 스타일로 만들어"
- "ui 컴포넌트 추가"
- `components/ui/` 에 새 컴포넌트 생성 시

## Rules

1. 파일 위치: `components/ui/[component-name].tsx` (kebab-case)
2. `'use client'` 는 인터랙션(onClick, hover state) 필요 시에만 추가
3. Props 타입은 파일 상단에 정의, `interface [Name]Props`
4. 항상 `className` prop 받아서 `cn()` 으로 merge
5. `variant` / `intensity` 로 스타일 분기 시 map 객체 사용

## Glassmorphism Base Pattern

```tsx
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

const intensityMap = {
  low:    'bg-white/5  backdrop-blur-sm  border-white/5',
  medium: 'bg-white/8  backdrop-blur-md  border-white/8',
  high:   'bg-white/12 backdrop-blur-xl  border-white/12',
}

export function GlassCard({ children, className, intensity = 'medium' }: GlassCardProps) {
  return (
    <div className={cn('rounded-2xl border', intensityMap[intensity], className)}>
      {children}
    </div>
  )
}
```

## Design Tokens (항상 이 값 사용)

| 목적 | 클래스 |
|------|--------|
| 배경 | `bg-white/5` ~ `bg-white/12` |
| 테두리 | `border-white/8` |
| blur | `backdrop-blur-md` |
| 그림자 | `shadow-[0_0_0_1px_rgba(255,255,255,0.05)]` |
| 라운드 | `rounded-2xl` |

## Gradient Text Pattern

```tsx
<span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
  텍스트
</span>
```

## Badge / Pill Pattern

```tsx
<span className={cn(
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
  'bg-white/5 border border-white/10 text-slate-300'
)}>
  라벨
</span>
```

## Checklist

- [ ] `cn()` import 확인 (`@/lib/utils`)
- [ ] `className` prop + merge 처리
- [ ] `backdrop-blur` 중첩 없음
- [ ] 불투명 테두리 사용 안 함
- [ ] 배경색 투명도 유지
