'use client'
import { useRef } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

interface MouseTiltResult {
  ref: React.RefObject<HTMLDivElement | null>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseLeave: () => void
}

export function useMouseTilt(strength = 12): MouseTiltResult {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(rawY, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(rawX, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(x * strength)
    rawY.set(-y * strength)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}
