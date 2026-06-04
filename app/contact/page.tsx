'use client'

import { useState, useRef } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import { ArrowRight } from '@/components/icons/Icons'

const ROLES = [
  'Sales / RevOps',
  'Marketing',
  'Customer Success / Support',
  'Operations',
  'Legal / Compliance',
  'Healthcare / Clinical',
  'Research / Analytics',
  'Engineering / IT',
  'Executive / Leadership',
  'Other',
]

const TEAM_SIZES = ['1 – 10', '11 – 50', '51 – 200', '201 – 1,000', '1,000+']

const TRUST_ITEMS = [
  { icon: '🔒', label: 'SOC 2 Type II certified' },
  { icon: '⚕', label: 'HIPAA-ready deployment' },
  { icon: '⚡', label: 'First reply under 1 hour' },
  { icon: '✦', label: 'No spam, ever' },
]

const FAQ = [
  { q: 'What happens after I submit?',         a: 'A real human reads every message and replies within one business hour. No bots, no canned responses.' },
  { q: 'Do I need a credit card to try it?',   a: 'No. The 14-day Team trial is completely free. We\'ll ask for payment details only when you\'re ready to upgrade.' },
  { q: 'Can I request a live demo?',           a: 'Yes — mention it in your message and we\'ll schedule a 30-minute walkthrough with a solutions engineer.' },
  { q: 'Is my data safe during a trial?',      a: 'All data is encrypted at rest and in transit. We never train on customer data and support full data deletion on request.' },
]

export default function ContactPage() {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrMsg('')
    setStatus('loading')

    const fd   = new FormData(e.currentTarget)
    const body = {
      name:     fd.get('name')     as string,
      email:    fd.get('email')    as string,
      company:  fd.get('company')  as string,
      role:     fd.get('role')     as string,
      teamsize: fd.get('teamsize') as string,
      message:  fd.get('message')  as string,
    }

    try {
      const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!data.success) { setErrMsg(data.error || 'Something went wrong'); setStatus('error'); return }
      setStatus('success')
      formRef.current?.reset()
    } catch {
      setErrMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <PageAnimations />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav basePath="/" />

      <main id="main">

        {/* ── HERO ── */}
        <section className="ct-hero">
          <div className="ct-hero-bg" aria-hidden="true">
            <div className="ct-hero-glow" />
            <div className="ct-hero-grid dot-grid" />
          </div>
          <div className="container ct-hero-inner">
            <div className="ct-hero-copy">
              <div className="ct-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>
                <span className="ct-eyebrow-dot" />
                Talk to us
              </div>
              <h1 className="ct-h1 hero-anim" style={{ animationDelay: '80ms' }}>
                Get in touch.<br />
                We reply <em>fast</em>.
              </h1>
              <p className="ct-lede hero-anim" style={{ animationDelay: '170ms' }}>
                Whether you have a question about features, pricing, need a demo, or just want to try it — we're here and happy to help.
              </p>

              {/* Trust signals */}
              <div className="ct-trust hero-anim" style={{ animationDelay: '260ms' }}>
                {TRUST_ITEMS.map((t, i) => (
                  <div key={i} className="ct-trust-item">
                    <span className="ct-trust-ic">{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>

              {/* Contact alternatives */}
              <div className="ct-alt hero-anim" style={{ animationDelay: '340ms' }}>
                <a href="mailto:hello@askthegenie.ai" className="ct-alt-link">
                  <span className="ct-alt-ic">✉</span>
                  <div>
                    <div className="ct-alt-label">Email us directly</div>
                    <div className="ct-alt-val">hello@askthegenie.ai</div>
                  </div>
                  <ArrowRight size={14} />
                </a>
                <a href="#" className="ct-alt-link">
                  <span className="ct-alt-ic">◆</span>
                  <div>
                    <div className="ct-alt-label">Book a demo</div>
                    <div className="ct-alt-val">30-min walkthrough</div>
                  </div>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* ── FORM ── */}
            <div className="ct-form-wrap hero-anim" style={{ animationDelay: '120ms' }}>
              {status === 'success' ? (
                <div className="ct-success">
                  <div className="ct-success-icon">✓</div>
                  <h2 className="ct-success-h">Message sent!</h2>
                  <p className="ct-success-p">
                    We received your message and will reply to <strong>{(formRef.current?.querySelector('[name=email]') as HTMLInputElement)?.defaultValue || 'your email'}</strong> within one business hour.
                  </p>
                  <button className="btn btn-ghost" onClick={() => setStatus('idle')}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="ct-form" noValidate>
                  <div className="ct-form-head">
                    <h2 className="ct-form-title">Send us a message</h2>
                    <p className="ct-form-sub">We reply within one business hour.</p>
                  </div>

                  {errMsg && (
                    <div className="ct-error" role="alert">{errMsg}</div>
                  )}

                  <div className="ct-row-2">
                    <div className="ct-field">
                      <label htmlFor="ct-name">Full name <span className="ct-req">*</span></label>
                      <input id="ct-name" name="name" type="text" placeholder="Jordan Mensah" required autoComplete="name" />
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-email">Work email <span className="ct-req">*</span></label>
                      <input id="ct-email" name="email" type="email" placeholder="jordan@northwind.com" required autoComplete="email" />
                    </div>
                  </div>

                  <div className="ct-row-2">
                    <div className="ct-field">
                      <label htmlFor="ct-company">Company</label>
                      <input id="ct-company" name="company" type="text" placeholder="Northwind Capital" autoComplete="organization" />
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-teamsize">Team size</label>
                      <select id="ct-teamsize" name="teamsize" defaultValue="">
                        <option value="" disabled>Select size</option>
                        {TEAM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-role">Your role</label>
                    <select id="ct-role" name="role" defaultValue="">
                      <option value="" disabled>Select your role</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-message">How can we help? <span className="ct-req">*</span></label>
                    <textarea
                      id="ct-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us about your team, what you're trying to solve, or just say hi…"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-accent ct-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <><span className="ct-spinner" /> Sending…</>
                    ) : (
                      <>Send message <ArrowRight size={14} /></>
                    )}
                  </button>

                  <p className="ct-legal">
                    By submitting you agree to our{' '}
                    <a href="#">Privacy Policy</a>. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ct-faq-section" aria-labelledby="faq-h">
          <div className="container ct-faq-inner">
            <div className="ct-faq-head" data-reveal="fade-right">
              <span className="eyebrow">FAQ</span>
              <h2 id="faq-h" className="section-title">Quick answers.</h2>
              <p className="section-lede">
                Still have questions?{' '}
                <a href="mailto:hello@askthegenie.ai" style={{ color: 'var(--accent)' }}>
                  Email us
                </a>{' '}
                and we'll reply fast.
              </p>
            </div>
            <div className="ct-faq-list" data-reveal="fade-left">
              {FAQ.map((f, i) => (
                <div key={i} className={`ct-faq-item${openFaq === i ? ' is-open' : ''}`}>
                  <button
                    className="ct-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <span className="ct-faq-icon" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <div className="ct-faq-a-wrap" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                    <div className="ct-faq-a-inner"><p>{f.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA STRIP ── */}
        <section className="ct-strip" data-reveal="fade-up">
          <div className="container ct-strip-inner">
            <div>
              <h2 className="ct-strip-h">Just want to try it?</h2>
              <p className="ct-strip-p">No sales call required — start your free 14-day trial in under 10 minutes.</p>
            </div>
            <a className="btn btn-accent btn-lg" href="/#cta">
              Start free trial <ArrowRight size={15} />
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

const CSS = `
/* ── Hero ── */
.ct-hero {
  position: relative;
  padding: clamp(72px,9vw,120px) 0 clamp(64px,8vw,108px);
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.ct-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.ct-hero-glow {
  position: absolute; left: 60%; top: -260px; transform: translateX(-50%);
  width: 900px; height: 700px; border-radius: 50%;
  background: radial-gradient(closest-side, var(--accent-glow), transparent 70%);
  filter: blur(50px); opacity: .75;
  animation: ctHeroGlow 6s ease-in-out infinite;
}
@keyframes ctHeroGlow {
  0%,100% { opacity:.6; transform:translateX(-50%) scale(1); }
  50%      { opacity:.9; transform:translateX(-50%) scale(1.1); }
}
.ct-hero-grid {
  position: absolute; inset: 0; opacity: .18;
  mask-image: radial-gradient(ellipse 70% 80% at 60% 0%, black 0%, transparent 70%);
}
.ct-hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: clamp(40px,6vw,96px); align-items: flex-start;
}
@media (max-width: 960px) { .ct-hero-inner { grid-template-columns: 1fr; } }

/* Copy side */
.ct-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-label); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--accent); font-weight: 600; margin-bottom: 20px;
}
.ct-eyebrow-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-glow);
  animation: ctDotPulse 2.5s ease-in-out infinite;
}
@keyframes ctDotPulse {
  0%,100% { box-shadow: 0 0 0 4px var(--accent-glow); }
  50%      { box-shadow: 0 0 0 8px var(--accent-glow); }
}
.ct-h1 {
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(42px,5.8vw,78px); line-height: .98;
  letter-spacing: -0.035em; margin: 0 0 22px; text-wrap: balance;
}
.ct-h1 em { font-style: normal; color: var(--accent); }
.ct-lede {
  color: var(--fg-muted); font-size: clamp(16px,1.35vw,19px);
  line-height: 1.6; max-width: 52ch; text-wrap: pretty; margin: 0 0 36px;
}

/* Trust signals */
.ct-trust {
  display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px;
}
.ct-trust-item {
  display: flex; align-items: center; gap: 12px;
  font-size: 14px; color: var(--fg-muted);
}
.ct-trust-ic {
  width: 32px; height: 32px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--accent-soft);
  border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
  font-size: 15px; flex-shrink: 0;
}

/* Contact alternatives */
.ct-alt { display: flex; flex-direction: column; gap: 10px; }
.ct-alt-link {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none; color: inherit;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.ct-alt-link:hover {
  border-color: color-mix(in oklab, var(--accent) 50%, transparent);
  transform: translateX(3px);
  box-shadow: 0 4px 20px -8px var(--accent-glow);
  opacity: 1;
}
.ct-alt-ic {
  width: 38px; height: 38px; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--accent-soft);
  border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
  color: var(--accent); font-size: 16px; flex-shrink: 0;
}
.ct-alt-label { font-size: 12px; color: var(--fg-subtle); font-family: var(--font-label); text-transform: uppercase; letter-spacing: .06em; }
.ct-alt-val { font-family: var(--font-display); font-weight: 600; font-size: 15px; letter-spacing: -0.01em; color: var(--fg); }
.ct-alt-link svg { margin-left: auto; color: var(--fg-subtle); transition: transform .2s; }
.ct-alt-link:hover svg { transform: translateX(3px); }

/* Form card */
.ct-form-wrap {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 32px 80px -32px color-mix(in oklab, var(--accent) 16%, transparent);
  transition: box-shadow .4s;
}
.ct-form-wrap:hover {
  box-shadow: 0 40px 96px -32px color-mix(in oklab, var(--accent) 22%, transparent);
}
.ct-form { padding: 36px 36px 28px; display: flex; flex-direction: column; gap: 18px; }
@media (max-width: 640px) { .ct-form { padding: 22px; } }
.ct-form-head { margin-bottom: 4px; }
.ct-form-title { font-family: var(--font-display); font-weight: 600; font-size: 22px; letter-spacing: -0.02em; margin: 0 0 4px; }
.ct-form-sub { font-size: 13.5px; color: var(--fg-muted); margin: 0; }

/* Fields */
.ct-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 560px) { .ct-row-2 { grid-template-columns: 1fr; } }
.ct-field { display: flex; flex-direction: column; gap: 6px; }
.ct-field label {
  font-size: 12.5px; font-weight: 500; color: var(--fg-muted);
  font-family: var(--font-label);
}
.ct-req { color: var(--accent); }
.ct-field input,
.ct-field select,
.ct-field textarea {
  padding: 10px 13px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 14.5px;
  outline: none;
  resize: vertical;
  transition: border-color .15s, box-shadow .15s;
}
.ct-field input:focus,
.ct-field select:focus,
.ct-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
}
.ct-field input::placeholder,
.ct-field textarea::placeholder { color: var(--fg-subtle); }

/* Submit */
.ct-submit { width: 100%; justify-content: center; margin-top: 4px; }
.ct-submit:disabled { opacity: .65; cursor: not-allowed; }
.ct-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  animation: ctSpin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes ctSpin { to { transform: rotate(360deg); } }
.ct-legal {
  font-size: 12px; color: var(--fg-subtle); text-align: center; margin: 0;
}
.ct-legal a { color: var(--accent); text-decoration: none; }

/* Error */
.ct-error {
  padding: 10px 14px;
  background: #fef2f2; color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
}

/* Success state */
.ct-success {
  padding: 56px 36px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 16px;
}
.ct-success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--accent-soft);
  border: 2px solid color-mix(in oklab, var(--accent) 40%, transparent);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 28px; color: var(--accent);
  animation: ctSuccessPop .5s cubic-bezier(.2,0,0,1) both;
}
@keyframes ctSuccessPop {
  from { opacity:0; transform:scale(.5); }
  to   { opacity:1; transform:scale(1); }
}
.ct-success-h { font-family: var(--font-display); font-size: 28px; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
.ct-success-p { color: var(--fg-muted); font-size: 15px; line-height: 1.6; max-width: 36ch; margin: 0; }

/* ── FAQ ── */
.ct-faq-section { padding: clamp(64px,8vw,112px) 0; border-top: 1px solid var(--border); }
.ct-faq-inner {
  display: grid; grid-template-columns: 1fr 1.4fr;
  gap: clamp(32px,5vw,80px); align-items: start;
}
@media (max-width: 880px) { .ct-faq-inner { grid-template-columns: 1fr; } }
.ct-faq-head { position: sticky; top: 100px; }
@media (max-width: 880px) { .ct-faq-head { position: static; } }
.ct-faq-list { display: flex; flex-direction: column; }
.ct-faq-item { border-bottom: 1px solid var(--border); transition: background .2s; }
.ct-faq-item:first-child { border-top: 1px solid var(--border); }
.ct-faq-item:hover { background: color-mix(in oklab, var(--accent) 3%, transparent); }
.ct-faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: 20px; padding: 20px 4px; background: transparent; border: 0; text-align: left;
  font-family: var(--font-display); font-size: 16px; font-weight: 500;
  letter-spacing: -0.005em; color: var(--fg);
  transition: color .15s; cursor: pointer;
}
.ct-faq-q:hover { color: var(--accent); }
.ct-faq-icon {
  width: 28px; height: 28px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); color: var(--fg-muted); flex-shrink: 0;
  font-size: 18px; font-weight: 300; line-height: 1;
  transition: background .2s, color .2s, border-color .2s, transform .3s;
}
.ct-faq-item.is-open .ct-faq-icon {
  background: var(--accent); color: var(--accent-fg);
  border-color: var(--accent); transform: rotate(180deg);
  box-shadow: 0 4px 12px -4px var(--accent-glow);
}
.ct-faq-a-wrap { display: grid; transition: grid-template-rows .28s var(--ease); }
.ct-faq-a-inner { overflow: hidden; }
.ct-faq-a-inner p {
  color: var(--fg-muted); font-size: 14.5px; line-height: 1.65;
  padding: 0 4px 20px; max-width: 64ch; text-wrap: pretty; margin: 0;
}

/* ── Bottom strip ── */
.ct-strip {
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
  padding: clamp(48px,6vw,80px) 0;
}
.ct-strip-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: clamp(24px,4vw,48px); flex-wrap: wrap;
}
.ct-strip-h { font-family: var(--font-display); font-weight: 600; font-size: clamp(24px,2.8vw,36px); letter-spacing: -0.025em; margin: 0 0 6px; }
.ct-strip-p { color: var(--fg-muted); font-size: 16px; margin: 0; max-width: 52ch; }
`
