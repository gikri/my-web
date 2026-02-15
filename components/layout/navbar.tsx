'use client'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '#about',    label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills',   label: 'Skills' },
  { href: '#contact',  label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4">
      <nav className={cn(
        'flex items-center gap-1 px-4 py-2.5 rounded-2xl border transition-all duration-300',
        scrolled
          ? 'bg-black/60 border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-white/[0.03] border-white/[0.06] backdrop-blur-sm'
      )}>
        <a href="#" className="mr-4 font-display font-bold text-slate-100 text-sm tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
          gikri<span className="text-violet-400">.</span>
        </a>

        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="ml-3 px-4 py-1.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 text-white text-sm font-medium border border-violet-500/30 transition-all duration-200 shadow-[0_0_16px_rgba(124,58,237,0.25)]"
        >
          Hire me
        </a>
      </nav>
    </header>
  )
}
