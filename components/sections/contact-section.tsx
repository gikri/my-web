'use client'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Send, Mail, Github, Twitter } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

const SOCIAL_LINKS = [
  { icon: Github,  label: 'GitHub',  href: 'https://github.com',  handle: '@gikri' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', handle: '@gikri' },
  { icon: Mail,    label: 'Email',   href: 'mailto:hello@gikri.dev', handle: 'hello@gikri.dev' },
]

export function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" ref={ref} className="relative py-28 px-4">
      {/* 배경 글로우 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          className="flex flex-col gap-4 mb-12 text-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline">Contact</Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100"
            style={{ fontFamily: 'var(--font-syne)' }}>
            Let&apos;s <span className="gradient-text">work together</span>
          </h2>
          <p className="text-slate-400 font-light max-w-md">
            Have a project in mind? I&apos;d love to hear about it. Drop a message and I&apos;ll get back within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 폼 */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <GlassCard intensity="medium" className="p-7">
              {sent ? (
                <motion.div
                  className="flex flex-col items-center gap-3 py-8 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                    <Send size={18} className="text-violet-400" />
                  </div>
                  <p className="font-semibold text-slate-100" style={{ fontFamily: 'var(--font-syne)' }}>Message sent!</p>
                  <p className="text-sm text-slate-500">I&apos;ll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    {(['Name', 'Email'] as const).map((field) => (
                      <div key={field} className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wide">{field}</label>
                        <input
                          type={field === 'Email' ? 'email' : 'text'}
                          required
                          placeholder={field === 'Email' ? 'you@example.com' : 'Your name'}
                          className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-medium uppercase tracking-wide">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  <button type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm border border-violet-500/30 transition-all shadow-[0_0_24px_rgba(124,58,237,0.3)] hover:shadow-[0_0_36px_rgba(124,58,237,0.5)]">
                    <Send size={14} /> Send message
                  </button>
                </form>
              )}
            </GlassCard>
          </motion.div>

          {/* 소셜 링크 */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-3"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {SOCIAL_LINKS.map((social, i) => (
              <motion.div key={social.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <GlassCard intensity="low" tilt tiltStrength={5}
                    className="glass-hover p-5 flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                      <social.icon size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{social.label}</p>
                      <p className="text-xs text-slate-500">{social.handle}</p>
                    </div>
                  </GlassCard>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
