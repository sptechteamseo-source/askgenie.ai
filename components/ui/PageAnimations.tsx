'use client'

/**
 * PageAnimations — drop <PageAnimations /> into any page to enable:
 *  • Scroll-reveal  →  data-reveal="fade-up|fade-left|fade-right|pop"
 *  • Count-up       →  data-countup="88%"
 *  • Hero entrance  →  className="hero-anim" style={{ animationDelay:'90ms' }}
 * CSS keyframes live in globals.css — no per-page duplication needed.
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageAnimations() {
  const pathname = usePathname()

  /* scroll reveal */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!els.length) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  /* count-up */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-countup]'))
    if (!els.length) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = el.dataset.countup ?? ''
        const suffix = target.replace(/[\d.]+/, '')
        const num = parseFloat(target)
        io.unobserve(el)
        if (isNaN(num)) { el.textContent = target; return }
        const dur = 1600; const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          el.textContent = (num < 10 ? (num * ease).toFixed(1).replace('.0', '') : Math.round(num * ease)) + suffix
          if (p < 1) requestAnimationFrame(tick); else el.textContent = target
        }
        requestAnimationFrame(tick)
      }),
      { threshold: 0.5 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
