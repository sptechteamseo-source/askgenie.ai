'use client'

import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'
import { ArrowRight } from '@/components/icons/Icons'
import PageAnimations from '@/components/ui/PageAnimations'

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From raw contract to cited answer, automatically.',
    body: 'Upload or connect your documents and AI for Legal Documents parses every clause, classifies the document type, and builds a searchable understanding of the text. Ask a question and it returns a grounded answer — with the exact clause and page cited so you can verify in one click.',
    bullets: ['Ingests PDFs, Word docs, scans & e-signature files', 'Extracts clauses, parties, dates, obligations & definitions', 'Answers in plain English, citing the exact clause'],
    link: { text: 'See how Finch Legal ramps associates in 6 days'},
    visual: {
      chrome: 'analyze · acme-msa-v3.pdf', title: 'Extracted clauses',
      rows: [
        { label: 'Limitation of liability — capped at 12 months fees', pill: '§9.2' },
        { label: 'Auto-renewal — 60-day notice required', pill: '§3.1' },
        { label: 'Governing law — State of Delaware', pill: '§14' },
      ],
    },
  },
  {
    kicker: 'Why businesses use it', n: '02',
    heading: "Because manual review doesn't scale — and risk doesn't wait.",
    body: 'Legal teams use AI for Legal Documents to handle the volume modern business demands: hundreds of contracts, NDAs and renewals a month, each one a potential liability if a clause is missed. Common use cases span the full document lifecycle.',
    bullets: ['Pre-signature contract review & redlining', 'NDA, MSA and DPA triage at intake', 'Due-diligence review for M&A and audits', 'Obligation & renewal tracking across the portfolio', 'Policy and regulatory compliance checks'],
    link: { text: "See Meridian Legal's audit workflow"},
    visual: {
      chrome: 'review queue · legal intake', title: "Today's document queue",
      rows: [
        { label: 'Vendor NDA — standard terms, no flags', pill: 'Cleared' },
        { label: 'Acme MSA — uncapped IP indemnity detected', pill: 'Risk' },
        { label: 'Reseller DPA — missing GDPR clause', pill: 'Flag' },
      ],
    },
  },
  {
    kicker: 'What you get', n: '03',
    heading: "A review process that's faster, safer and fully auditable.",
    body: "Every answer AI for Legal Documents returns is grounded in your own documents and cited to the source clause — so your team moves faster without trading away accuracy or compliance. The outcome is a defensible, repeatable review process the whole business can rely on.",
    bullets: ['Cited, audit-ready answers on every question', 'Risk flags surfaced before a contract is signed', 'A complete log of every question, source & answer', 'Consistent review quality across the whole team'],
    link: { text: 'See the outcomes legal teams report'},
    visual: {
      chrome: 'answer · liability cap?', title: 'Cited answer',
      rows: [
        { label: 'Liability capped at 12 months of fees', pill: '§9.2' },
        { label: 'Mutual indemnity — both parties', pill: '§9.4' },
        { label: 'No cap on IP / confidentiality breach', pill: 'Risk' },
      ],
    },
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your documents', body: 'Securely connect your contract repository, drive or DMS — or drag in PDFs and Word files. AI for Legal Documents ingests and indexes everything in minutes, respecting your existing permissions.' },
  { kicker: 'Step 2', n: '02', title: 'Ask in plain English', body: 'Type a question like "what\'s the liability cap in the Acme MSA?" No query syntax, no folder hunting — just ask the way you\'d ask a colleague.' },
  { kicker: 'Step 3', n: '03', title: 'Verify the cited clause', body: 'Get a grounded answer with the exact clause, section and page cited. Click any citation to jump straight to the source text and confirm in one second.' },
  { kicker: 'Step 4', n: '04', title: 'Automate & roll out', body: 'Turn repeat questions into automated review workflows, set risk alerts, and roll AI for Legal Documents out across your legal team with a full audit trail.' },
]

const PROBLEMS = [
  { icon: '⚖', title: 'Manual contract review', body: 'Surface the clauses that matter in seconds — no line-by-line reading.' },
  { icon: '⏱', title: 'Slow document processing', body: 'Analyze hundreds of documents in parallel — same-day, not multi-day.' },
  { icon: '§', title: 'Compliance challenges', body: 'Auto-check every document against GDPR, HIPAA and SOC 2 before signature.' },
  { icon: '⚠', title: 'Risk identification', body: 'Catch uncapped liability, auto-renewals and missing indemnities automatically.' },
  { icon: '◇', title: 'Management bottlenecks', body: 'Track obligations, renewals and key dates across the whole portfolio.' },
  { icon: '✓', title: 'Human errors', body: 'Cited answers let reviewers verify instead of relying on memory.' },
]

const FEATURES = [
  { icon: '⛿', title: 'Document analysis', body: 'Understands contracts end-to-end — parties, obligations and intent.' },
  { icon: '≡', title: 'Contract summarization', body: 'A 40-page agreement distilled to a 5-line summary of what matters.' },
  { icon: '⚠', title: 'Risk detection', body: 'Flags unusual indemnities, liability and non-standard language.' },
  { icon: '⌗', title: 'Clause extraction', body: 'Every clause pulled and labelled into a searchable view.' },
  { icon: '§', title: 'Compliance monitoring', body: 'Checks against your playbook and regulations, flagging gaps.' },
  { icon: '🔍', title: 'AI-powered search', body: 'Ask anything across the repository, get the exact clause cited.' },
]

const BENEFITS = ['Faster legal reviews', 'Reduced operational costs', 'Improved compliance', 'Better accuracy', 'Increased productivity', 'Faster decision making']

const STATS = [
  { n: '90%',    label: 'Faster first-pass contract review across legal teams',  source: 'source: 11 legal customer surveys · 2026' },
  { n: '4.7×',  label: 'Faster audit & due-diligence preparation',               source: 'source: Meridian Legal deployment' },
  { n: '100%',  label: 'Clause-level citation coverage on every answer',          source: 'source: ATG answer logs' },
  { n: '6 days', label: 'To ramp a new associate to billable review work',        source: 'source: Finch Legal onboarding' },
]

const LOGOS = ['Northwind', 'Helio Health', 'Lattice', 'Orbit', 'Finch Legal', 'Parallax', 'Atlas Robotics', 'Vector Bank', 'Quanta Lab', 'Meridian', 'Cascade', 'Beacon AI']

const MORE = [
  { icon: '$',  title: 'Revenue teams',    desc: 'Brief execs in seconds, surface blockers, win more renewals — without combing through 30 tabs.', link: 'See revenue stories', href: '/customers' },
  { icon: '↻',  title: 'Customer success', desc: 'Cut resolution time, double CSAT, halve escalations — give agents grounded answers, not search results.', link: 'See support stories', href: '/customers' },
  { icon: '◇',  title: 'Operations',       desc: 'Make institutional memory searchable across timezones, teams, and tools — even offline.', link: 'See ops stories', href: '/customers' },
  { icon: '◎',  title: 'Researcher',       desc: 'Run a literature review in an afternoon — every claim cited to the exact paper and page.', link: 'Explore researcher', href: '/use-cases/researcher' },
]

const PAGE_CSS = `
        /* ── Persona hero ── */
        .persona-hero { position:relative; padding:clamp(72px,9vw,120px) 0 clamp(56px,7vw,96px); overflow:hidden; border-bottom:1px solid var(--border); }
        .persona-hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; }
        .persona-hero-bg .glow { position:absolute; right:-200px; top:-200px; width:900px; height:700px; border-radius:50%; background:radial-gradient(closest-side,var(--accent-glow),transparent 70%); filter:blur(40px); opacity:.8; }
        .persona-hero-bg .grid { position:absolute; inset:0; opacity:.2; background-image:radial-gradient(circle,var(--border) 1px,transparent 1px); background-size:28px 28px; mask-image:radial-gradient(ellipse 70% 80% at 50% 0%,black 0%,transparent 70%); }
        .persona-hero-inner { position:relative; z-index:1; display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(32px,5vw,72px); align-items:center; }
        @media(max-width:920px){.persona-hero-inner{grid-template-columns:1fr;}}
        .persona-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-label); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:18px; }
        .persona-eyebrow::before { content:""; width:28px; height:1px; background:currentColor; }
        .persona-h1 { font-family:var(--font-display); font-weight:600; font-size:clamp(40px,5.6vw,76px); line-height:1; letter-spacing:-0.035em; margin:0 0 22px; text-wrap:balance; max-width:14ch; }
        .persona-h1 em { font-style:normal; color:var(--accent); }
        .persona-lede { color:var(--fg-muted); font-size:clamp(17px,1.45vw,21px); line-height:1.55; max-width:58ch; text-wrap:pretty; margin:0 0 28px; }
        .persona-cta-row { display:flex; gap:10px; flex-wrap:wrap; }
        /* Visual card */
        .persona-visual { position:relative; aspect-ratio:4/5; border-radius:var(--radius-lg); background:radial-gradient(closest-side at 30% 30%,var(--accent-glow),transparent 70%),var(--bg-elevated); border:1px solid var(--border); overflow:hidden; box-shadow:0 40px 80px -40px color-mix(in oklab,var(--accent) 30%,transparent); }
        @media(max-width:920px){.persona-visual{aspect-ratio:16/11;}}
        .pv-card { position:absolute; border:1px solid var(--border); border-radius:var(--radius-md); background:color-mix(in oklab,var(--bg) 88%,transparent); backdrop-filter:blur(8px); padding:14px 16px; box-shadow:0 12px 30px -10px rgba(0,0,0,.25); }
        .pv-card-a{left:8%;top:12%;width:56%;}
        .pv-card-b{right:6%;top:38%;width:50%;}
        .pv-card-c{left:14%;bottom:8%;width:64%;}
        .pv-card .pv-h{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-subtle);margin-bottom:6px;}
        .pv-card .pv-t{font-family:var(--font-display);font-weight:600;font-size:14px;line-height:1.3;letter-spacing:-0.005em;color:var(--fg);margin:0 0 8px;}
        .pv-card .pv-cite{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--accent);padding:3px 8px;border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);border-radius:999px;background:var(--accent-soft);}
        .pv-card .pv-bar{height:4px;border-radius:4px;background:var(--bg-sunken);margin-top:8px;overflow:hidden;}
        .pv-card .pv-bar>i{display:block;height:100%;background:var(--accent);width:70%;border-radius:4px;}
        /* Uses section */
        .persona-uses{padding:clamp(64px,8vw,112px) 0;}
        .persona-uses-h{font-family:var(--font-display);font-size:clamp(32px,4vw,52px);font-weight:600;letter-spacing:-0.03em;line-height:1.05;margin:0 0 18px;max-width:22ch;text-wrap:balance;}
        .persona-uses-lede{color:var(--fg-muted);font-size:clamp(16px,1.3vw,19px);line-height:1.55;max-width:60ch;margin:0 0 56px;}
        .use-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:center;margin:clamp(48px,7vw,96px) 0;}
        .use-row.is-reversed{direction:rtl;}
        .use-row.is-reversed>*{direction:ltr;}
        @media(max-width:880px){.use-row,.use-row.is-reversed{grid-template-columns:1fr;direction:ltr;}}
        .use-step-num{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-label);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:14px;}
        .use-step-num span{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid color-mix(in oklab,var(--accent) 40%,transparent);background:var(--accent-soft);border-radius:999px;font-family:var(--font-display);font-size:12px;}
        .use-h{font-family:var(--font-display);font-size:clamp(26px,2.8vw,38px);font-weight:600;letter-spacing:-0.025em;line-height:1.1;margin:0 0 16px;text-wrap:balance;}
        .use-p{color:var(--fg-muted);font-size:16.5px;line-height:1.65;max-width:52ch;margin:0 0 22px;}
        .use-list{list-style:none;padding:0;margin:0 0 22px;display:flex;flex-direction:column;gap:10px;}
        .use-list li{display:flex;align-items:flex-start;gap:12px;font-size:15px;line-height:1.5;color:var(--fg);}
        .use-list li::before{content:"";flex-shrink:0;margin-top:7px;width:14px;height:14px;border-radius:50%;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 40%,transparent);}
        .use-link{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-label);font-size:13.5px;font-weight:500;color:var(--accent);text-decoration:none;}
        .use-link:hover{opacity:.8;}
        /* Use visual mockup */
        .use-visual{position:relative;aspect-ratio:5/4;border-radius:var(--radius-lg);border:1px solid var(--border);background:var(--bg-elevated);overflow:hidden;}
        .use-visual .glow{position:absolute;right:-60px;top:-60px;width:360px;height:360px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);filter:blur(20px);opacity:.6;}
        .use-visual .chrome{position:absolute;left:18px;right:18px;top:18px;height:32px;border-radius:8px;background:var(--bg-sunken);border:1px solid var(--border);display:flex;align-items:center;padding:0 12px;gap:8px;font-family:var(--font-mono);font-size:11.5px;color:var(--fg-subtle);}
        .use-visual .chrome::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:14px 0 0 var(--neutral-300),28px 0 0 var(--neutral-300);}
        .use-visual .stage{position:absolute;left:18px;right:18px;top:62px;bottom:18px;border-radius:10px;border:1px solid var(--border);background:var(--bg);padding:18px;overflow:hidden;}
        .use-visual .stage h5{font-family:var(--font-display);font-weight:600;font-size:13px;letter-spacing:-0.01em;margin:0 0 12px;}
        .use-visual .stage .row{display:flex;align-items:center;gap:10px;padding:10px 12px;margin:6px 0;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;font-size:12px;}
        .use-visual .stage .row .pill{margin-left:auto;font-family:var(--font-mono);font-size:10px;padding:3px 8px;border-radius:999px;color:var(--accent);background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);}
        .use-visual .stage .row .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);}
        .use-visual .stage .row .label{color:var(--fg);flex:1;}
        /* Steps */
        .persona-more{padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--border);}
        .persona-more-h{font-family:var(--font-display);font-size:clamp(26px,3vw,40px);font-weight:600;letter-spacing:-0.025em;margin:0 0 36px;text-wrap:balance;max-width:24ch;}
        .legal-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
        @media(max-width:920px){.legal-steps{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.legal-steps{grid-template-columns:1fr;}}
        .legal-step{position:relative;display:flex;flex-direction:column;gap:14px;padding:28px 26px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;min-height:240px;}
        .legal-step::before{content:"";position:absolute;right:-40px;top:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);opacity:.35;pointer-events:none;}
        .legal-step-kicker{font-family:var(--font-label);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-subtle);position:relative;}
        .legal-step-n{position:relative;display:inline-flex;align-items:baseline;gap:8px;font-family:var(--font-display);font-weight:600;font-size:48px;line-height:1;letter-spacing:-0.04em;color:var(--accent);}
        .legal-step h3{position:relative;font-family:var(--font-display);font-weight:600;font-size:19px;line-height:1.2;letter-spacing:-0.015em;margin:0;text-wrap:balance;}
        .legal-step p{position:relative;color:var(--fg-muted);font-size:14px;line-height:1.6;margin:0;flex:1;}
        /* Problems */
        .legal-problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 40px;}
        @media(max-width:760px){.legal-problem-grid{grid-template-columns:1fr;gap:0;}}
        .legal-problem{display:flex;gap:16px;align-items:flex-start;padding:22px 0;border-bottom:1px solid var(--border);}
        .legal-problem-ic{flex-shrink:0;width:38px;height:38px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);font-size:17px;}
        .legal-problem h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
        .legal-problem p{font-size:13.5px;color:var(--fg-muted);line-height:1.5;margin:0;}
        /* Features */
        .cs-eyebrow-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap;}
        .legal-feat-panel{border-top:1px solid var(--border);border-left:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-elevated);display:grid;grid-template-columns:1fr 1fr;}
        @media(max-width:760px){.legal-feat-panel{grid-template-columns:1fr;}}
        .legal-feat{display:flex;gap:16px;align-items:flex-start;padding:24px 26px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
        .legal-feat-ic{flex-shrink:0;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;background:var(--bg-sunken);border:1px solid var(--border);color:var(--accent);font-size:16px;}
        .legal-feat h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
        .legal-feat p{font-size:13px;color:var(--fg-muted);line-height:1.5;margin:0;}
        /* Benefits */
        .legal-benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        @media(max-width:760px){.legal-benefit-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:460px){.legal-benefit-grid{grid-template-columns:1fr;}}
        .legal-benefit{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-elevated);font-family:var(--font-display);font-weight:600;font-size:15px;letter-spacing:-0.01em;transition:border-color var(--dur) var(--ease);}
        .legal-benefit:hover{border-color:color-mix(in oklab,var(--accent) 40%,transparent);}
        .legal-benefit .chk{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);}
        /* Quote */
        .persona-quote{position:relative;padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:radial-gradient(closest-side at 0% 50%,var(--accent-glow),transparent 70%),var(--bg);}
        .persona-quote-inner{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(28px,5vw,72px);align-items:center;}
        @media(max-width:880px){.persona-quote-inner{grid-template-columns:1fr;}}
        .persona-quote-card{position:relative;aspect-ratio:1/1;border-radius:var(--radius-lg);background:repeating-linear-gradient(135deg,color-mix(in oklab,var(--accent) 12%,transparent) 0 14px,transparent 14px 30px),var(--bg-elevated);border:1px solid var(--border);overflow:hidden;display:flex;align-items:flex-end;padding:24px;}
        .persona-quote-card::before{content:'“';position:absolute;left:20px;top:-10px;font-family:var(--font-display);font-weight:600;font-size:200px;color:var(--accent);line-height:1;opacity:.2;}
        .persona-quote-card .name{font-family:var(--font-display);font-weight:600;font-size:20px;letter-spacing:-0.015em;color:var(--fg);}
        .persona-quote-card .role{font-size:13px;color:var(--fg-muted);margin-top:4px;}
        .persona-quote-card-inner{z-index:1;}
        .persona-quote-text q{display:block;font-family:var(--font-display);font-weight:600;font-size:clamp(22px,2.6vw,36px);line-height:1.25;letter-spacing:-0.025em;color:var(--fg);text-wrap:pretty;quotes:none;margin:0 0 28px;}
        .persona-quote-text q::before{content:'“';color:var(--accent);padding-right:4px;}
        .persona-quote-text q::after{content:'”';color:var(--accent);padding-left:4px;}
        .persona-quote-attr{font-family:var(--font-label);font-size:13px;letter-spacing:.04em;color:var(--fg-muted);text-transform:uppercase;}
        /* Stats */
        .persona-stats{padding:clamp(56px,7vw,96px) 0;}
        .persona-stats-h{font-family:var(--font-display);font-size:clamp(28px,3vw,42px);font-weight:600;letter-spacing:-0.025em;text-align:center;margin:0 auto 48px;max-width:22ch;text-wrap:balance;}
        .persona-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-elevated);overflow:hidden;}
        @media(max-width:720px){.persona-stat-grid{grid-template-columns:repeat(2,1fr);}}
        .persona-stat-cell{padding:28px;border-right:1px solid var(--border);}
        .persona-stat-cell:last-child{border-right:0;}
        @media(max-width:720px){.persona-stat-cell{border-right:1px solid var(--border);}.persona-stat-cell:nth-child(2n){border-right:0;}.persona-stat-cell:nth-child(1),.persona-stat-cell:nth-child(2){border-bottom:1px solid var(--border);}}
        .persona-stat-n{font-family:var(--font-display);font-weight:600;font-size:clamp(36px,4.4vw,56px);line-height:1;letter-spacing:-0.03em;color:var(--accent);}
        .persona-stat-l{font-size:13.5px;color:var(--fg-muted);line-height:1.45;margin-top:12px;}
        .persona-stat-source{font-family:var(--font-mono);font-size:10.5px;color:var(--fg-subtle);margin-top:8px;}
        /* Discover more */
        .persona-more-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        @media(max-width:880px){.persona-more-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px){.persona-more-grid{grid-template-columns:1fr;}}
        .persona-more-card{display:flex;flex-direction:column;gap:14px;padding:24px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-elevated);text-decoration:none;color:inherit;transition:border-color var(--dur) var(--ease),transform var(--dur) var(--ease);position:relative;overflow:hidden;min-height:220px;}
        .persona-more-card::after{content:"";position:absolute;right:-40px;bottom:-40px;width:140px;height:140px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);opacity:0;transition:opacity var(--dur) var(--ease);}
        .persona-more-card:hover{border-color:var(--accent);transform:translateY(-2px);opacity:1;}
        .persona-more-card:hover::after{opacity:.8;}
        .persona-more-icon{width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:17px;}
        .persona-more-h3{font-family:var(--font-display);font-size:18px;font-weight:600;letter-spacing:-0.015em;margin:0;}
        .persona-more-p{font-size:13.5px;color:var(--fg-muted);line-height:1.5;margin:0;flex:1;}
        .persona-more-link{font-family:var(--font-label);font-size:12.5px;font-weight:500;color:var(--accent);display:inline-flex;align-items:center;gap:6px;margin-top:auto;}
        /* Logo wall */
        .cs-logos{display:grid;grid-template-columns:repeat(6,1fr);gap:0;border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-elevated);}
        @media(max-width:880px){.cs-logos{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:480px){.cs-logos{grid-template-columns:repeat(2,1fr);}}
        .cs-logo{padding:28px 16px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:600;font-size:18px;letter-spacing:-0.02em;color:var(--fg-muted);border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
        .cs-logo:nth-child(6n){border-right:0;}
        .cs-section{padding:clamp(48px,6vw,80px) 0;}
`

export default function AIForLegalDocumentsPage() {
  return (
    <>
      <PageAnimations />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <Nav basePath="/" />

      <main id="main">

        {/* ── HERO ── */}
        <section className="persona-hero" aria-labelledby="ph1">
          <div className="persona-hero-bg" aria-hidden="true">
            <div className="grid"></div>
            <div className="glow"></div>
          </div>
          <div className="container persona-hero-inner">
            <div>
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For legal, compliance &amp; contract teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Legal Documents</em> that reviews contracts in seconds.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for Legal Documents from Ask the Genie reads your contracts, policies and filings — then answers any question with the exact clause cited. Review faster, surface risk earlier, and stay compliant, without drowning in manual document review.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="/#cta">
                  Start Free Trial <ArrowRight size={14} />
                </a>
                <a className="btn btn-ghost" href="/#demo">
                  Schedule Demo
                </a>
              </div>
            </div>

            <div className="persona-visual hero-anim" role="img" aria-label="Three illustrative legal document answer cards" style={{ animationDelay: '200ms' }}>
              <div className="pv-card pv-card-a">
                <div className="pv-h">Question</div>
                <p className="pv-t">What&apos;s the liability cap in the Acme MSA?</p>
                <span className="pv-cite">● Contracts · Policies · Filings</span>
              </div>
              <div className="pv-card pv-card-b">
                <div className="pv-h">Answer · 6s</div>
                <p className="pv-t">Liability capped at 12 months of fees (§9.2). Mutual indemnity. No cap on IP breach.</p>
                <span className="pv-cite">3 clauses cited</span>
                <div className="pv-bar"><i></i></div>
              </div>
              <div className="pv-card pv-card-c">
                <div className="pv-h">Source · Acme MSA v3</div>
                <p className="pv-t">Section 9.2 — Limitation of Liability · Last edited 4d ago</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Legal Documents — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              AI for Legal Documents is software that reads legal text the way a lawyer would — understanding clauses, obligations, risks and definitions — and answers questions about it in plain language, with every claim cited back to the exact source. It turns hours of manual contract review into seconds of grounded analysis.
            </p>
            {EXPLAINED.map((item, i) => (
              <div key={i} className={`use-row${i % 2 === 1 ? ' is-reversed' : ''}`} data-reveal={i % 2 === 0 ? 'fade-left' : 'fade-right'}>
                <div>
                  <div className="use-step-num"><span>{item.n}</span> {item.kicker}</div>
                  <h3 className="use-h">{item.heading}</h3>
                  <p className="use-p">{item.body}</p>
                  <ul className="use-list">
                    {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                  {/*
                  <a className="use-link" href={item.link.href}>
                    {item.link.text} <ArrowRight size={14} />
                  </a>*/
}
<a className="use-link" href="#">
  {item.link.text} <ArrowRight size={14} />
</a>
                </div>
                <div className="use-visual" aria-hidden="true">
                  <div className="glow"></div>
                  <div className="chrome">{item.visual.chrome}</div>
                  <div className="stage">
                    <h5>{item.visual.title}</h5>
                    {item.visual.rows.map((r, k) => (
                      <div className="row" key={k}>
                        <span className="dot"></span>
                        <span className="label">{r.label}</span>
                        <span className="pill">{r.pill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="persona-more" aria-labelledby="howto-h">
          <div className="container">
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Legal Documents: step-by-step.</h2>
            <p className="persona-uses-lede" style={{ marginBottom: 36 }}>
              Getting started with AI for Legal Documents takes four steps — no implementation project, no training course. Connect, ask, verify, and roll it out across your legal team.
            </p>
            <div className="legal-steps">
              {STEPS.map((s, i) => (
                <article className="legal-step" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 90}ms` } as any}>
                  <div className="legal-step-kicker">{s.kicker}</div>
                  <div className="legal-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ── */}
        <section className="persona-more" aria-labelledby="problems-h">
          <div className="container">
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Ask the Genie related to AI for Legal Documents.</h2>
            <div className="legal-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div className="legal-problem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${(i % 2) * 80}ms` } as any}>
                  <span className="legal-problem-ic">{p.icon}</span>
                  <div><h3>{p.title}</h3><p>{p.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES & BENEFITS ── */}
        <section className="persona-more" aria-labelledby="features-h" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI for Legal Documents — features, benefits &amp; key capabilities.</h2>
            <div className="cs-eyebrow-row"><span className="eyebrow">Key features</span></div>
            <div className="legal-feat-panel">
              {FEATURES.map((f, i) => (
                <div className="legal-feat" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 50}ms` } as any}>
                  <span className="legal-feat-ic">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.body}</p></div>
                </div>
              ))}
            </div>
            <div className="cs-eyebrow-row" style={{ marginTop: 48 }}>
              <span className="eyebrow">Benefits for legal teams &amp; businesses</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit" key={i} data-reveal="pop" style={{ '--reveal-delay': `${i * 60}ms` } as any}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className="persona-quote" aria-labelledby="quote-h">
          <div className="container persona-quote-inner">
            <div className="persona-quote-card" data-reveal="fade-right">
              <div className="persona-quote-card-inner">
                <div className="name">Reza Karimi</div>
                <div className="role">Head of Compliance · Meridian Legal</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">Audit prep used to be a two-week sprint every quarter. With AI for Legal Documents it&apos;s two days — every answer cites the exact clause, so our auditors verify in seconds.</q>
              <div className="persona-quote-attr">— Meridian Legal · 180 seats · legal services</div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes legal teams report.</h2>
            <div className="persona-stat-grid" role="list">
              {STATS.map((s, i) => (
                <div className="persona-stat-cell" role="listitem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 80}ms` } as any}>
                  <div className="persona-stat-n" data-countup={s.n}>{s.n}</div>
                  <div className="persona-stat-l">{s.label}</div>
                  <div className="persona-stat-source">{s.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCOVER MORE ── */}
        <section className="persona-more" aria-labelledby="more-h">
          <div className="container">
            <h2 id="more-h" className="persona-more-h" data-reveal="fade-up">Discover how other teams use askthegenie.</h2>
            <div className="persona-more-grid">
              {MORE.map((m, i) => (
                <a className="persona-more-card" href={m.href} key={i} data-reveal="pop" style={{ '--reveal-delay': `${i * 70}ms` } as any}>
                  <span className="persona-more-icon">{m.icon}</span>
                  <h3 className="persona-more-h3">{m.title}</h3>
                  <p className="persona-more-p">{m.desc}</p>
                  <span className="persona-more-link">
                    {m.link} <ArrowRight size={13} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO WALL ── */}
        <section className="cs-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up"><span className="eyebrow" id="cs-logos-h">Trusted by teams at</span></div>
            <div className="cs-logos" role="list">
              {LOGOS.map((l) => <div className="cs-logo" role="listitem" key={l}>{l}</div>)}
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  )
}
