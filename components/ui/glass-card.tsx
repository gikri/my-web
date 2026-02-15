'use client'
import { motion } from 'framer-motion'
import { useMouseTilt } from '@/lib/hooks/use-mouse-tilt'
import { cn } from '@/lib/utils/cn'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: 'low' | 'medium' | 'high'
  tilt?: boolean
  tiltStrength?: number
}

const intensityMap = {
  low:    'bg-white/[0.03] border-white/[0.06]',
  medium: 'bg-white/[0.05] border-white/[0.09]',
  high:   'bg-white/[0.08] border-white/[0.14]',
}

export function GlassCard({ children, className, style, intensity = 'medium', tilt = false, tiltStrength = 10 }: GlassCardProps) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt(tiltStrength)

  if (!tilt) {
    return (
      <div style={style} className={cn('rounded-2xl border backdrop-blur-xl', intensityMap[intensity], className)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, ...style }}
      className={cn(
        'rounded-2xl border backdrop-blur-xl transition-shadow duration-300',
        'hover:shadow-[0_0_40px_rgba(124,58,237,0.12)]',
        intensityMap[intensity],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
