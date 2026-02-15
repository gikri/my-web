import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const variantMap = {
  primary: 'bg-violet-600 hover:bg-violet-500 text-white border-transparent shadow-[0_0_24px_rgba(124,58,237,0.3)] hover:shadow-[0_0_36px_rgba(124,58,237,0.5)]',
  ghost:   'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10',
  outline: 'bg-transparent hover:bg-white/5 text-slate-200 border-white/15 hover:border-white/25',
}

const sizeMap = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({ children, className, variant = 'ghost', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border font-medium',
        'transition-all duration-200 cursor-pointer',
        variantMap[variant],
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
