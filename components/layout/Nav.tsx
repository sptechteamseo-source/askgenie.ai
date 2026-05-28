'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ArrowRight } from '@/components/icons/Icons'

interface NavLink {
  label: string
  href: string
  absolute?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Product',   href: '#product'  },
  { label: 'Features',  href: '#features' },
  { label: 'Use cases', href: '#usecases' },
  { label: 'Pricing',   href: '#pricing'  },
  { label: 'FAQ',       href: '#faq'      },
]

const BLOG_LINK:      NavLink = { label: 'Blog',      href: '/blog',      absolute: true }
const CUSTOMERS_LINK: NavLink = { label: 'Customers', href: '/customers', absolute: true }

interface NavProps {
  basePath?: string
}

export default function Nav({ basePath = '' }: NavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: color-mix(in oklab, var(--bg) 70%, transparent);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-bottom: 1px solid transparent;
          transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
        }
        .nav--scrolled { border-bottom-color: var(--border); }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 68px; gap: 24px;
        }
        .brand {
          display: inline-flex; align-items: center; gap: 9px;
          text-decoration: none; color: var(--fg);
          font-family: var(--font-display);
          font-weight: 600; font-size: 17.5px; letter-spacing: -0.025em;
        }
        .brand-mark { display: inline-flex; align-items: center; width: 28px; height: 28px; }
        .brand-logo--dark { display: none; }
        [data-theme="dark"] .brand-logo--light { display: none; }
        [data-theme="dark"] .brand-logo--dark  { display: block; }
        .brand-tld { color: var(--fg-subtle); font-weight: 500; }
        .nav-links { display: flex; gap: 4px; }
        .nav-link {
          padding: 8px 12px;
          font-family: var(--font-display); font-size: 14px; font-weight: 500;
          color: var(--fg-muted); text-decoration: none; border-radius: 8px;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
        }
        .nav-link:hover { color: var(--fg); background: var(--bg-elevated); opacity: 1; }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        @media (max-width: 880px) { .nav-links { display: none; } }
      `}</style>

      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href={`${basePath}#top`} className="brand" aria-label="askthegenie">
            <span className="brand-mark" aria-hidden="true">
              <Image
                src="/logo-light.svg" alt="" width={28} height={28}
                className="brand-logo brand-logo--light"
              />
              <Image
                src="/logo-dark.svg" alt="" width={28} height={28}
                className="brand-logo brand-logo--dark"
              />
            </span>
            <span className="brand-word">
              askthegenie<span className="brand-tld">.ai</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={`${basePath}${l.href}`} className="nav-link">{l.label}</a>
            ))}
            <a href={BLOG_LINK.href} className="nav-link">{BLOG_LINK.label}</a>
            <a href={CUSTOMERS_LINK.href} className="nav-link">{CUSTOMERS_LINK.label}</a>
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <a className="nav-link" href={`${basePath}#signin`} style={{ color: 'var(--fg-muted)' }}>
              Sign in
            </a>
            <a className="btn btn-primary btn-sm" href={`${basePath}#cta`}>
              Get started <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
