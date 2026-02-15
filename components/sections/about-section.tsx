'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { value: '3+',  label: 'Years Experience' },
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'Happy Clients' },
]

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} className="relative py-28 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* 왼쪽: 텍스트 */}
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Badge variant="outline">About me</Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 leading-[1.1]"
            style={{ fontFamily: 'var(--font-syne)' }}>
            Building the web<br />
            <span className="gradient-text">one layer at a time</span>
          </h2>
          <p className="text-slate-400 font-light leading-relaxed">
            I&apos;m a full-stack developer who loves building products that feel fast,
            look incredible, and just work. From pixel-perfect interfaces to
            high-performance APIs, I care deeply about the details.
          </p>
          <p className="text-slate-500 font-light leading-relaxed text-sm">
            When I&apos;m not shipping code, I&apos;m exploring new design systems,
            contributing to open source, or building side projects that push limits.
          </p>
        </motion.div>

        {/* 오른쪽: 스탯 카드 */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* 프로필 카드 */}
          <GlassCard intensity="medium" tilt tiltStrength={8}
            className="p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-syne)' }}>
              G
            </div>
            <div>
              <p className="font-semibold text-slate-100" style={{ fontFamily: 'var(--font-syne)' }}>gikri</p>
              <p className="text-sm text-slate-500">Full-stack Developer</p>
              <p className="text-xs text-slate-600 mt-1">Seoul, Korea</p>
            </div>
          </GlassCard>

          {/* 스탯 그리드 */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <GlassCard intensity="low" className="p-4 text-center">
                  <p className="text-2xl font-bold gradient-text" style={{ fontFamily: 'var(--font-syne)' }}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
