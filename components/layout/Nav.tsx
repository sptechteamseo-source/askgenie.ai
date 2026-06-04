'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ArrowRight } from '@/components/icons/Icons'

interface NavLink {
  label: string
  href: string
  absolute?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Product',  href: '#product'  },
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'FAQ',      href: '#faq'      },
]

const EXTRA_LINKS: NavLink[] = [
  { label: 'Blog',    href: '/blog',    absolute: true },
  { label: 'Contact', href: '/contact', absolute: true },
]

const USE_CASE_LINKS = [
  {
    href: '/use-cases/ai-for-legal-documents',
    icon: '⚖',
    title: 'AI for Legal Documents',
    desc:  'Contract review, clause extraction & risk detection',
  },
  {
    href: '/use-cases/researcher',
    icon: '◎',
    title: 'Researcher',
    desc:  'Summarize papers, synthesize & cite sources',
  },
  {
    href: '/use-cases/sales',
    icon: '◆',
    title: 'Sales',
    desc:  'Deal intelligence, call prep & instant CRM answers',
  },
  {
    href: '/use-cases/marketing',
    icon: '✦',
    title: 'Marketing',
    desc:  'Campaign research, on-brand content & instant answers',
  },
  {
    href: '/use-cases/healthcare',
    icon: '✚',
    title: 'Healthcare',
    desc:  'Clinical answers, policy lookup & compliance',
  },
]

interface NavProps {
  basePath?: string
}

export default function Nav({ basePath = '' }: NavProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [ddOpen,    setDdOpen]    = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)

  // Scroll border effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on scroll
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  // Close dropdown on outside click / Escape
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDdOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  const allNavLinks = [...NAV_LINKS, ...EXTRA_LINKS]

  return (
    <>
      <style>{`
        /* ── Shared nav shell ──────────────────────────── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: color-mix(in oklab, var(--bg) 80%, transparent);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-bottom: 1px solid transparent;
          transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
        }
        .nav--scrolled { border-bottom-color: var(--border); }

        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; gap: 16px;
        }

        /* ── Logo / brand ──────────────────────────────── */
        .brand {
          display: inline-flex; align-items: center; gap: 9px;
          text-decoration: none; color: var(--fg);
          font-family: var(--font-display);
          font-weight: 600; font-size: 17px; letter-spacing: -0.025em;
          flex-shrink: 0;
        }
        .brand-mark { display: inline-flex; align-items: center; width: 28px; height: 28px; flex-shrink: 0; }
        .brand-logo--dark { display: none; }
        [data-theme="dark"] .brand-logo--light { display: none; }
        [data-theme="dark"] .brand-logo--dark  { display: block; }
        .brand-tld { color: var(--fg-subtle); font-weight: 500; }

        /* ── Desktop nav links ─────────────────────────── */
        .nav-links { display: flex; gap: 2px; align-items: center; }
        .nav-link {
          padding: 8px 11px;
          font-family: var(--font-display); font-size: 13.5px; font-weight: 500;
          color: var(--fg-muted); text-decoration: none; border-radius: 8px;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--fg); background: var(--bg-elevated); opacity: 1; }

        /* ── Use-cases dropdown ────────────────────────── */
        .nav-dd { position: relative; }
        .nav-dd-toggle {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 8px 11px;
          font-family: var(--font-display); font-size: 13.5px; font-weight: 500;
          color: var(--fg-muted); background: transparent; border: none;
          border-radius: 8px; cursor: pointer;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .nav-dd-toggle:hover,
        .nav-dd-toggle[aria-expanded="true"] { color: var(--fg); background: var(--bg-elevated); }
        .nav-dd-caret {
          transition: transform 0.18s ease;
        }
        .nav-dd-toggle[aria-expanded="true"] .nav-dd-caret { transform: rotate(180deg); }

        .nav-dd-menu {
          position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          min-width: 280px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 16px 40px -8px rgba(0,0,0,.18);
          padding: 8px;
          z-index: 200;
          animation: ddIn 0.16s ease;
        }
        @keyframes ddIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .nav-dd-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px;
          border-radius: 8px;
          text-decoration: none; color: inherit;
          transition: background var(--dur-fast) var(--ease);
        }
        .nav-dd-item:hover { background: var(--bg-sunken); opacity: 1; }
        .nav-dd-ic {
          flex-shrink: 0;
          width: 34px; height: 34px;
          border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--accent-soft);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          color: var(--accent);
          font-size: 15px;
        }
        .nav-dd-t {
          display: block;
          font-family: var(--font-display); font-weight: 600;
          font-size: 13.5px; color: var(--fg);
          letter-spacing: -0.01em;
        }
        .nav-dd-d {
          display: block;
          font-size: 12px; color: var(--fg-muted);
          margin-top: 2px; line-height: 1.4;
        }
        .nav-dd-sep { height: 1px; background: var(--border); margin: 6px 0; }
        .nav-dd-all {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          border-radius: 8px;
          font-family: var(--font-label); font-size: 12px; font-weight: 500;
          color: var(--accent); text-decoration: none;
          transition: background var(--dur-fast) var(--ease);
        }
        .nav-dd-all:hover { background: var(--accent-soft); opacity: 1; }

        /* ── Desktop right actions ─────────────────────── */
        .nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .nav-sign-in { color: var(--fg-muted); }

        /* ── Hamburger button (mobile only) ────────────── */
        .nav-hamburger {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          background: transparent; border: 1px solid var(--border);
          color: var(--fg); cursor: pointer;
          transition: background var(--dur-fast) var(--ease);
          flex-shrink: 0;
        }
        .nav-hamburger:hover { background: var(--bg-elevated); }

        /* ── Mobile full-screen menu ───────────────────── */
        .nav-mobile {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0; bottom: 0;
          background: var(--bg);
          z-index: 99;
          flex-direction: column;
          overflow-y: auto;
          border-top: 1px solid var(--border);
          animation: mobileMenuIn 0.22s var(--ease);
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile--open { display: flex; }

        .nav-mobile-links {
          display: flex; flex-direction: column;
          flex: 1;
        }
        .nav-mobile-link {
          display: flex; align-items: center;
          padding: 16px var(--gutter);
          color: var(--fg);
          font-size: 1.05rem;
          font-weight: 500;
          font-family: var(--font-display);
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: background var(--dur-fast) var(--ease);
        }
        .nav-mobile-link:hover { background: var(--bg-elevated); opacity: 1; }

        .nav-mobile-actions {
          padding: 20px var(--gutter) 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--border);
          margin-top: 8px;
        }
        .nav-mobile-btn {
          justify-content: center;
          width: 100%;
          padding: 14px;
        }

        /* ── Responsive breakpoints ────────────────────── */
        @media (max-width: 880px) {
          .nav-links   { display: none; }
          .nav-sign-in { display: none; }
          .nav-hamburger { display: flex; }
        }

        @media (max-width: 480px) {
          .brand-word { font-size: 15px; }
          /* Hide "Get started" text label on very small, show only icon */
          .nav-cta-label { display: none; }
        }
      `}</style>

      {/* ── Sticky nav bar ─────────────────────────────── */}
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav-inner">

          {/* Logo */}
          <a href={`${basePath}#top`} className="brand" aria-label="askthegenie home">
            <span className="brand-mark" aria-hidden="true">
              <Image src="/logo-light.svg" alt="" width={28} height={28} className="brand-logo brand-logo--light" />
              <Image src="/logo-dark.svg"  alt="" width={28} height={28} className="brand-logo brand-logo--dark"  />
            </span>
            <span className="brand-word">
              askthegenie<span className="brand-tld">.ai</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="nav-links" aria-label="Primary">
            {/* Product + Features */}
            {NAV_LINKS.slice(0, 2).map((l) => (
              <a key={l.href} href={`${basePath}${l.href}`} className="nav-link">{l.label}</a>
            ))}

            {/* Use cases dropdown */}
            <div
              className="nav-dd"
              ref={ddRef}
              onMouseEnter={() => setDdOpen(true)}
              onMouseLeave={() => setDdOpen(false)}
            >
              <button
                className="nav-dd-toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded={ddOpen}
                onClick={() => setDdOpen((o) => !o)}
              >
                Use cases
                <svg className="nav-dd-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {ddOpen && (
                <div className="nav-dd-menu" role="menu">
                  {USE_CASE_LINKS.map((uc) => (
                    <a key={uc.href} className="nav-dd-item" href={uc.href} role="menuitem" onClick={() => setDdOpen(false)}>
                      <span className="nav-dd-ic" aria-hidden="true">{uc.icon}</span>
                      <span>
                        <span className="nav-dd-t">{uc.title}</span>
                        <span className="nav-dd-d">{uc.desc}</span>
                      </span>
                    </a>
                  ))}
                  <div className="nav-dd-sep" aria-hidden="true" />
                  <a className="nav-dd-all" href={`${basePath}#usecases`} role="menuitem" onClick={() => setDdOpen(false)}>
                    All use cases
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Pricing + FAQ */}
            {NAV_LINKS.slice(2).map((l) => (
              <a key={l.href} href={`${basePath}${l.href}`} className="nav-link">{l.label}</a>
            ))}

            {EXTRA_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="nav-actions">
           <ThemeToggle />

            {/* Sign in — hidden on mobile via CSS */}
            <a className="nav-link nav-sign-in" href={`${basePath}#signin`}>
              Sign in
            </a>

            {/* Get started — always visible */}
            <a className="btn btn-primary btn-sm" href={`${basePath}#cta`}>
              <span className="nav-cta-label">Get started</span>
              <ArrowRight size={14} />
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6"  y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6"  x2="21" y2="6"  />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-down menu ──────────────────────── */}
      <div
        className={`nav-mobile ${menuOpen ? 'nav-mobile--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="nav-mobile-links">
          {NAV_LINKS.slice(0, 2).map((l) => (
            <a key={l.href} href={`${basePath}${l.href}`} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
          {/* Use cases submenu items in mobile */}
          {USE_CASE_LINKS.map((uc) => (
            <a key={uc.href} href={uc.href} className="nav-mobile-link" onClick={closeMenu} style={{ paddingLeft: 'calc(var(--gutter) + 20px)', fontSize: '0.95rem', color: 'var(--fg-muted)' }}>
              {uc.icon} {uc.title}
            </a>
          ))}
          {NAV_LINKS.slice(2).map((l) => (
            <a key={l.href} href={`${basePath}${l.href}`} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
          {EXTRA_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-mobile-actions">
          <a
            href={`${basePath}#signin`}
            className="btn btn-ghost nav-mobile-btn"
            onClick={closeMenu}
          >
            Sign in
          </a>
          <a
            href={`${basePath}#cta`}
            className="btn btn-accent nav-mobile-btn"
            onClick={closeMenu}
          >
            Get started <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </>
  )
}
