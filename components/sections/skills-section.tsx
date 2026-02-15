'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils/cn'

const SKILL_GROUPS = [
  {
    category: 'Frontend',
    color: 'text-violet-400',
    shadowClass: 'shadow-[0_0_40px_rgba(124,58,237,0.15)]',
    skills: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand'],
  },
  {
    category: 'Backend',
    color: 'text-cyan-400',
    shadowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.12)]',
    skills: ['FastAPI', 'Python 3.11', 'PostgreSQL', 'Redis', 'REST API', 'WebSocket'],
  },
  {
    category: 'DevOps',
    color: 'text-emerald-400',
    shadowClass: 'shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    skills: ['Vercel', 'Docker', 'GitHub Actions', 'Nginx', 'AWS S3', 'Cloudflare'],
  },
]

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" ref={ref} className="relative py-28 px-4">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="glow-indigo-soft w-[600px] h-[300px] rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          className="flex flex-col gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline">Skills</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            My <span className="gradient-text">toolkit</span>
          </h2>
          <p className="text-slate-400 font-light max-w-lg">
            Technologies I work with daily to ship fast, reliable products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.12 + 0.2 }}
            >
              <GlassCard intensity="medium" className={cn('p-6 flex flex-col gap-5 h-full', group.shadowClass)}>
                <span className={cn('font-display text-xs font-semibold uppercase tracking-widest', group.color)}>
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: gi * 0.12 + 0.3 + si * 0.05 }}
                    >
                      <Badge variant="default" className="text-[11px] font-medium">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
