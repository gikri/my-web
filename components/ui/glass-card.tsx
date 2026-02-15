'use client'
import { motion } from 'framer-motion'
import { useMouseTilt } from '@/lib/hooks/use-mouse-tilt'
import { cn } from '@/lib/utils/cn'

type Intensity = 'low' | 'medium' | 'high'

type GlassCardProps =
  | {
      children: React.ReactNode
      className?: string
      intensity?: Intensity
      tilt?: false
      tiltStrength?: never
    }
  | {
      children: React.ReactNode
      className?: string
      intensity?: Intensity
      tilt: true
      tiltStrength?: number
    }

const intensityMap: Record<Intensity, string> = {
  low:    'bg-white/[0.03] border-white/[0.06]',
  medium: 'bg-white/[0.05] border-white/[0.09]',
  high:   'bg-white/[0.08] border-white/[0.14]',
}

const BASE = 'rounded-2xl border backdrop-blur-xl'

function TiltCard({ children, className, intensity = 'medium', tiltStrength = 10 }: {
  children: React.ReactNode
  className?: string
  intensity?: Intensity
  tiltStrength?: number
}) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt(tiltStrength)

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn(BASE, 'transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.12)]', intensityMap[intensity], className)}
    >
      {children}
    </motion.div>
  )
}

export function GlassCard({ children, className, intensity = 'medium', tilt, tiltStrength }: GlassCardProps) {
  if (tilt) {
    return (
      <TiltCard intensity={intensity} tiltStrength={tiltStrength} className={className}>
        {children}
      </TiltCard>
    )
  }

  return (
    <div className={cn(BASE, intensityMap[intensity], className)}>
      {children}
    </div>
  )
}
