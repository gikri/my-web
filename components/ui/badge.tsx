import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'outline'
}

const variantMap = {
  default: 'bg-white/5 border-white/10 text-slate-300',
  accent:  'bg-violet-500/10 border-violet-500/20 text-violet-300',
  outline: 'bg-transparent border-white/15 text-slate-400',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
      'text-xs font-medium border tracking-wide',
      variantMap[variant],
      className
    )}>
      {children}
    </span>
  )
}
