'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Twitter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const FLOAT_CARDS = [
  { label: 'Next.js 14', sub: 'App Router', delay: 0,    pos: 'top-[18%] right-[8%]',   rot: 'rotate-3' },
  { label: 'FastAPI',    sub: 'Python 3.11', delay: 0.4, pos: 'bottom-[30%] left-[6%]',  rot: '-rotate-2' },
  { label: 'Vercel',     sub: 'Edge Deploy', delay: 0.8, pos: 'top-[55%] right-[4%]',   rot: 'rotate-1' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* 배경 글로우 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.05) 50%, transparent 75%)' }} />
      <div className="absolute top-[30%] right-[20%] w-64 h-64 rounded-full pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />

      {/* 플로팅 기술 카드 */}
      {FLOAT_CARDS.map((card) => (
        <motion.div
          key={card.label}
          className={`absolute hidden lg:flex flex-col gap-0.5 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.04] backdrop-blur-xl pointer-events-none ${card.pos} ${card.rot}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { delay: card.delay + 1, duration: 0.6 }, y: { delay: card.delay + 1, duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <span className="text-xs font-semibold text-slate-200">{card.label}</span>
          <span className="text-[10px] text-slate-500">{card.sub}</span>
        </motion.div>
      ))}

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="accent" className="gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Available for work
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.05]"
          style={{ fontFamily: 'var(--font-syne)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-slate-100">Crafting</span>
          <br />
          <span className="gradient-text">Digital</span>
          <br />
          <span className="text-slate-100">Experiences</span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-base sm:text-lg text-slate-400 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Full-stack developer specializing in modern web applications.
          Next.js, FastAPI, and thoughtful UI/UX.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-3 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm border border-violet-500/30 transition-all duration-200 shadow-[0_0_28px_rgba(124,58,237,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
          >
            View Projects <ArrowRight size={15} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            Get in touch
          </a>
        </motion.div>

        <motion.div
          className="flex items-center gap-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="text-slate-600 hover:text-slate-300 transition-colors">
            <Github size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
            className="text-slate-600 hover:text-slate-300 transition-colors">
            <Twitter size={18} />
          </a>
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-slate-600 tracking-widest uppercase">scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-transparent to-slate-600"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
