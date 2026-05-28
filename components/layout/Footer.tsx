import Image from 'next/image'
import { Twitter, Linkedin, Github, Globe } from '@/components/icons/Icons'
import { FOOTER_LINKS } from '@/lib/data'

export default function Footer() {
  return (
    <>
      <style>{`
        .foot { padding: 64px 0 32px; border-top: 1px solid var(--border); background: var(--bg); }
        .foot-top { display: grid; grid-template-columns: 1.1fr 2fr; gap: 56px; padding-bottom: 56px; }
        @media (max-width: 1000px) { .foot-top { grid-template-columns: 1fr; gap: 40px; } }
        .foot-brand .brand { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; color: var(--fg); font-family: var(--font-display); font-weight: 600; font-size: 17.5px; letter-spacing: -0.025em; }
        .foot-brand .brand-logo--dark { display: none; }
        [data-theme="dark"] .foot-brand .brand-logo--light { display: none; }
        [data-theme="dark"] .foot-brand .brand-logo--dark  { display: block; }
        .foot-brand .brand-tld { color: var(--fg-subtle); font-weight: 500; }
        .foot-tag { color: var(--fg-muted); font-size: 14px; max-width: 320px; line-height: 1.55; margin-top: 16px; }
        .foot-social { display: flex; gap: 8px; margin-top: 22px; }
        .foot-social a {
          width: 36px; height: 36px; border-radius: 9999px; border: 1px solid var(--border);
          display: inline-flex; align-items: center; justify-content: center;
          color: var(--fg-muted); text-decoration: none;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
        }
        .foot-social a:hover { color: var(--fg); background: var(--bg-elevated); opacity: 1; }
        .foot-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 720px) { .foot-cols { grid-template-columns: repeat(2, 1fr); } }
        .foot-col { display: flex; flex-direction: column; gap: 8px; }
        .foot-col a { color: var(--fg-muted); font-size: 13.5px; text-decoration: none; transition: color var(--dur-fast) var(--ease); }
        .foot-col a:hover { color: var(--fg); opacity: 1; }
        .foot-h { font-family: var(--font-display); font-weight: 600; font-size: 13px; letter-spacing: -0.005em; margin-bottom: 4px; }
        .foot-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 24px; border-top: 1px solid var(--border);
          font-size: 12.5px; color: var(--fg-subtle);
          flex-wrap: wrap; gap: 12px;
        }
        .foot-legal { display: flex; gap: 18px; }
        .foot-legal a { color: var(--fg-subtle); text-decoration: none; font-size: 12.5px; transition: color var(--dur-fast) var(--ease); }
        .foot-legal a:hover { color: var(--fg); opacity: 1; }
        .foot-region { display: inline-flex; align-items: center; gap: 8px; }
      `}</style>

      <footer className="foot">
        <div className="container">
          <div className="foot-top">
            <div className="foot-brand">
              <a href="#top" className="brand" aria-label="askthegenie">
                <span style={{ display: 'inline-flex', alignItems: 'center', width: 28, height: 28 }}>
                  <Image src="/logo-light.svg" alt="" width={28} height={28} className="brand-logo brand-logo--light" />
                  <Image src="/logo-dark.svg"  alt="" width={28} height={28} className="brand-logo brand-logo--dark"  />
                </span>
                <span className="brand-word">
                  askthegenie<span className="brand-tld">.ai</span>
                </span>
              </a>
              <p className="foot-tag">
                The AI workspace your team can verify. Built for revenue,
                support and operations leaders who can't afford a wrong answer.
              </p>
              <div className="foot-social">
                <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
                <a href="#" aria-label="GitHub"><Github size={16} /></a>
              </div>
            </div>

            <div className="foot-cols">
              {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                <div key={section} className="foot-col">
                  <div className="foot-h">{section}</div>
                  {links.map((l) => (
                    <a key={l.label} href={l.href}>{l.label}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="foot-bottom">
            <div className="muted">© 2026 askthegenie, inc. All rights reserved.</div>
            <div className="foot-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">DPA</a>
              <a href="#">Cookies</a>
            </div>
            <div className="foot-region">
              <Globe size={13} /> US-East · EU-West · APAC available
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
