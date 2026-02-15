'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types'

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Linear Clone',
    description: 'A project management tool inspired by Linear, built with Next.js App Router and real-time collaboration.',
    tags: ['Next.js', 'TypeScript', 'Prisma'],
    gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    url: '#',
  },
  {
    id: '2',
    title: 'AI Dashboard',
    description: 'Analytics dashboard for ML models with live metrics, custom charts, and FastAPI backend.',
    tags: ['FastAPI', 'React', 'Recharts'],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    url: '#',
  },
  {
    id: '3',
    title: 'Design System',
    description: 'Component library with glassmorphism design tokens, Storybook docs, and Tailwind integration.',
    tags: ['Tailwind', 'Storybook', 'Radix'],
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    url: '#',
  },
  {
    id: '4',
    title: 'E-commerce API',
    description: 'High-performance REST API with FastAPI, PostgreSQL, Redis caching, and async processing.',
    tags: ['FastAPI', 'PostgreSQL', 'Redis'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    url: '#',
  },
  {
    id: '5',
    title: 'Portfolio Generator',
    description: 'Auto-generates portfolio sites from GitHub profile. Uses Vercel AI SDK for bio generation.',
    tags: ['Vercel AI', 'Next.js', 'GitHub API'],
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    url: '#',
  },
  {
    id: '6',
    title: 'Realtime Chat',
    description: 'WebSocket-based chat with persistent history, file uploads, and end-to-end encryption.',
    tags: ['WebSocket', 'Next.js', 'FastAPI'],
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    url: '#',
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <GlassCard tilt tiltStrength={7} intensity="medium"
        className="group p-6 h-full flex flex-col gap-4 glass-hover cursor-pointer relative overflow-hidden">
        {/* 카드 그라디언트 배경 */}
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none', project.gradient)} />

        <div className="relative flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-slate-100 leading-tight">
              {project.title}
            </h3>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title} 열기`}
                className="text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          <p className="text-sm text-slate-400 font-light leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" ref={ref} className="relative py-28 px-4">
      {/* 섹션 헤더 */}
      <div className="max-w-5xl mx-auto mb-14">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline">Projects</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            Things I&apos;ve <span className="gradient-text">built</span>
          </h2>
          <p className="text-slate-400 font-light max-w-xl">
            A selection of projects across full-stack development, design systems, and APIs.
          </p>
        </motion.div>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
      >
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          View all on GitHub <ArrowRight size={13} />
        </a>
      </motion.div>
    </section>
  )
}
