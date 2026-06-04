'use client'

import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import Image from 'next/image'
import { ArrowRight } from '@/components/icons/Icons'
import PageAnimations from '@/components/ui/PageAnimations'

function ImageSlot({ placeholder = 'Drop an image' }: { placeholder?: string }) {
  return (
    <div className="img-slot-frame">
      <div className="img-slot-ring" />
      <div className="img-slot-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="img-slot-cap">{placeholder}</span>
      </div>
    </div>
  )
}

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From scattered campaign data to a cited answer, instantly.',
    body: 'Connect your analytics, content library, briefs and brand guidelines, and AI for Marketing reads every asset and report — building a single, searchable memory of your marketing. Ask a question and it returns a grounded answer, with the exact dashboard, doc or asset cited so you can verify in one click.',
    bullets: [
      'Connects GA4, HubSpot, Notion, Drive & your CMS',
      'Reads briefs, past content, analytics & brand guides',
      'Answers in plain language, citing the exact source',
    ],
    placeholder: 'Campaign snapshot',
    img: '/images/marketing-how-it-works.png',
    imgAlt: 'AI for Marketing — connects GA4, HubSpot, Notion, Drive, CMS and Brand Guidelines to give cited answers',
  },
  {
    kicker: 'Why marketing teams use it', n: '02',
    heading: "Because your best work is buried — and deadlines don't wait.",
    body: "Marketers use AI for Marketing to stop reinventing what they already know. The messaging that worked, the brand rules, last quarter's numbers — it's scattered across a dozen tools. AI for Marketing puts it one question away. Common use cases span the whole content lifecycle.",
    bullets: [
      'Campaign & competitor research',
      'On-brand content & copy drafting',
      'Repurposing assets across channels',
      'Analytics & performance Q&A',
      'Briefs, recaps & reporting',
    ],
    placeholder: 'Campaign snapshot',
    img: '/images/Why-newmarketing-teams-use-it.png',
    imgAlt: 'AI for Marketing — connects GA4, HubSpot, Notion, Drive, CMS and Brand Guidelines to give cited answers',
  },
  {
    kicker: 'What you get', n: '03',
    heading: "A marketing motion that's faster, on-brand and fully sourced.",
    body: 'Every answer AI for Marketing returns is grounded in your own work and cited to the source — so your team moves faster without going off-brand or guessing at the numbers. The outcome is quicker research, consistent messaging, and reporting you can stand behind.',
    bullets: [
      'Cited, verifiable answers on every question',
      'Consistent brand voice across every channel',
      'A complete trail of every source & number',
      'Less rework, more shipped campaigns',
    ],
    placeholder: 'Cited answer',
    img: '/images/What_you_get_marketing.png',
    imgAlt: 'What_you_get_marketing',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your marketing stack', body: 'Securely connect GA4, HubSpot, your CMS, Notion and Drive. AI for Marketing indexes your analytics, content and brand docs in minutes, respecting your existing permissions.' },
  { kicker: 'Step 2', n: '02', title: 'Ask about any campaign', body: 'Type a question like "what messaging worked best for our Q1 launch?" or "draft a launch email in our brand voice." No reports to build — just ask the way you\'d ask a teammate.' },
  { kicker: 'Step 3', n: '03', title: 'Verify the cited source', body: 'Get a grounded answer with the exact dashboard, asset or brand-guide section cited. Click any citation to jump straight to the source and confirm in one second.' },
  { kicker: 'Step 4', n: '04', title: 'Automate & roll out', body: 'Turn recurring questions into automated briefs and reports, draft on-brand copy in a click, and roll AI for Marketing out across the team with a full audit trail.' },
]

const PROBLEMS = [
  { icon: '⚡', title: 'Slow campaign research', body: 'Pull what worked, what didn\'t and why into one cited answer — in seconds.' },
  { icon: '◈', title: 'Off-brand content', body: 'Every draft grounded in your brand guide and proven messaging, automatically.' },
  { icon: '↻', title: 'Repurposing busywork', body: 'Turn one asset into blog, social and email variants without starting over.' },
  { icon: '◉', title: 'Reporting that drags', body: 'Ask your analytics in plain English and get cited numbers, not dashboard digging.' },
  { icon: '⌖', title: 'Reinventing past work', body: 'Surface the campaign, brief or line that already worked instead of rewriting it.' },
  { icon: '✓', title: 'Guesswork & errors', body: 'Cited answers let marketers verify claims instead of trusting memory.' },
]

const FEATURES = [
  { icon: '⌖', title: 'Campaign research', body: 'Instant briefings pulled from analytics, past campaigns and the open web.' },
  { icon: '✎', title: 'On-brand drafting', body: 'Copy and content generated in your brand voice, grounded in your guide.' },
  { icon: '↻', title: 'Content repurposing', body: 'One asset reshaped into blog, social, email and ad variants in a click.' },
  { icon: '◉', title: 'Analytics Q&A', body: 'Ask your performance data in plain English, get the exact metric cited.' },
  { icon: '⚔', title: 'Competitive intel', body: 'Track competitor messaging and positioning, surfaced when you need it.' },
  { icon: '🔍', title: 'Marketing search', body: 'Ask anything across your content and reports, get the exact source cited.' },
]

const BENEFITS = [
  'Faster campaign research',
  'Consistent brand voice',
  'More content shipped',
  'Reporting in seconds',
  'Less rework',
  'Data-backed decisions',
]

const STATS = [
  { n: '3.5h', label: 'Saved per marketer, per week on research & reporting', source: 'source: 8 marketing customer surveys · 2026' },
  { n: '2.4×', label: 'More content shipped without adding headcount', source: 'source: Cascade deployment' },
  { n: '100%', label: 'Of answers cited to your own data & assets', source: 'source: ATG answer logs' },
  { n: '38%', label: 'Higher CTR from messaging grounded in past wins', source: 'source: customer-reported A/B tests' },
]

const LOGOS = ['Northwind', 'Lattice', 'Orbit', 'Ridgeline', 'Vector Bank', 'Cascade', 'Helio Health', 'Beacon AI', 'Parallax', 'Atlas Robotics', 'Finch Legal', 'Quanta Lab']

const MORE = [
  { icon: '⚖', title: 'AI for Legal Documents', desc: 'Review contracts, extract clauses and surface risk in seconds — every answer cited to the exact clause.', link: 'Explore legal use case', href: '/use-cases/ai-for-legal-documents' },
  { icon: '◆', title: 'Sales', desc: 'Prep for calls in seconds, follow up the same day, and never lose a deal to a missed detail again.', link: 'Explore sales use case', href: '/use-cases/sales' },
  { icon: '✚', title: 'Healthcare', desc: 'Answer clinical, operational and compliance questions — cited from your protocols, policies, and payer rules.', link: 'Explore healthcare use case', href: '/use-cases/healthcare' },
  { icon: '◎', title: 'Researcher', desc: 'Run a literature review in an afternoon — every claim cited to the exact paper and page.', link: 'Explore researcher', href: '/use-cases/researcher' },
]

const PAGE_CSS = `
        .persona-hero{position:relative;padding:clamp(72px,9vw,120px) 0 clamp(56px,7vw,96px);overflow:hidden;border-bottom:1px solid var(--border);}
        .persona-hero-bg{position:absolute;inset:0;z-index:0;pointer-events:none;}
        .persona-hero-bg .glow{position:absolute;right:-200px;top:-200px;width:900px;height:700px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);filter:blur(40px);opacity:.8;}
        .persona-hero-bg .grid{position:absolute;inset:0;opacity:.2;background-image:radial-gradient(circle,var(--border) 1px,transparent 1px);background-size:28px 28px;mask-image:radial-gradient(ellipse 70% 80% at 50% 0%,black 0%,transparent 70%);}
        .persona-hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(32px,5vw,72px);align-items:center;}
        @media(max-width:920px){.persona-hero-inner{grid-template-columns:1fr;}}
        .persona-eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-label);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:18px;}
        .persona-eyebrow::before{content:"";width:28px;height:1px;background:currentColor;}
        .persona-h1{font-family:var(--font-display);font-weight:600;font-size:clamp(40px,5.6vw,76px);line-height:1;letter-spacing:-0.035em;margin:0 0 22px;text-wrap:balance;max-width:14ch;}
        .persona-h1 em{font-style:normal;color:var(--accent);}
        .persona-lede{color:var(--fg-muted);font-size:clamp(17px,1.45vw,21px);line-height:1.55;max-width:58ch;text-wrap:pretty;margin:0 0 28px;}
        .persona-cta-row{display:flex;gap:10px;flex-wrap:wrap;}
        .persona-visual{position:relative;aspect-ratio:4/5;border-radius:var(--radius-lg);background:radial-gradient(closest-side at 30% 30%,var(--accent-glow),transparent 70%),var(--bg-elevated);border:1px solid var(--border);overflow:hidden;box-shadow:0 40px 80px -40px color-mix(in oklab,var(--accent) 30%,transparent);}
        @media(max-width:920px){.persona-visual{aspect-ratio:16/11;}}
        .pv-card{position:absolute;border:1px solid var(--border);border-radius:var(--radius-md);background:color-mix(in oklab,var(--bg) 88%,transparent);backdrop-filter:blur(8px);padding:14px 16px;box-shadow:0 12px 30px -10px rgba(0,0,0,.25);}
        .pv-card-a{left:8%;top:12%;width:56%;}
        .pv-card-b{right:6%;top:38%;width:50%;}
        .pv-card-c{left:14%;bottom:8%;width:64%;}
        .pv-card .pv-h{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-subtle);margin-bottom:6px;}
        .pv-card .pv-t{font-family:var(--font-display);font-weight:600;font-size:14px;line-height:1.3;letter-spacing:-0.005em;color:var(--fg);margin:0 0 8px;}
        .pv-card .pv-cite{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--accent);padding:3px 8px;border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);border-radius:999px;background:var(--accent-soft);}
        .pv-card .pv-bar{height:4px;border-radius:4px;background:var(--bg-sunken);margin-top:8px;overflow:hidden;}
        .pv-card .pv-bar>i{display:block;height:100%;background:var(--accent);width:70%;border-radius:4px;}
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
        .use-visual--img{position:relative;aspect-ratio:5/4;border-radius:16px;border:1px dashed var(--border);background:var(--bg-elevated);overflow:hidden;}
        .use-visual--img.has-img{border-style:solid;border-color:var(--border);background:var(--bg);}
        .use-visual-img-real{border-radius:14px;}
        .img-slot-frame{position:absolute;inset:0;border-radius:16px;overflow:hidden;background:color-mix(in oklab,var(--bg) 60%,transparent);display:flex;align-items:center;justify-content:center;}
        .img-slot-ring{position:absolute;inset:0;border:1.5px dashed color-mix(in oklab,var(--fg) 22%,transparent);border-radius:16px;pointer-events:none;}
        .img-slot-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:12px;color:var(--fg-subtle);}
        .img-slot-empty svg{opacity:.4;color:var(--fg-subtle);}
        .img-slot-cap{font-size:13px;font-weight:500;color:var(--fg-subtle);letter-spacing:.01em;}
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
        .legal-problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 40px;}
        @media(max-width:760px){.legal-problem-grid{grid-template-columns:1fr;gap:0;}}
        .legal-problem{display:flex;gap:16px;align-items:flex-start;padding:22px 0;border-bottom:1px solid var(--border);}
        .legal-problem-ic{flex-shrink:0;width:38px;height:38px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);font-size:17px;}
        .legal-problem h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
        .legal-problem p{font-size:13.5px;color:var(--fg-muted);line-height:1.5;margin:0;}
        .cs-eyebrow-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap;}
        .legal-feat-panel{border-top:1px solid var(--border);border-left:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-elevated);display:grid;grid-template-columns:1fr 1fr;}
        @media(max-width:760px){.legal-feat-panel{grid-template-columns:1fr;}}
        .legal-feat{display:flex;gap:16px;align-items:flex-start;padding:24px 26px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
        .legal-feat-ic{flex-shrink:0;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;background:var(--bg-sunken);border:1px solid var(--border);color:var(--accent);font-size:16px;}
        .legal-feat h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
        .legal-feat p{font-size:13px;color:var(--fg-muted);line-height:1.5;margin:0;}
        .legal-benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        @media(max-width:760px){.legal-benefit-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:460px){.legal-benefit-grid{grid-template-columns:1fr;}}
        .legal-benefit{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-elevated);font-family:var(--font-display);font-weight:600;font-size:15px;letter-spacing:-0.01em;transition:border-color var(--dur) var(--ease);}
        .legal-benefit:hover{border-color:color-mix(in oklab,var(--accent) 40%,transparent);}
        .legal-benefit .chk{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);}
        .persona-quote{position:relative;padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:radial-gradient(closest-side at 0% 50%,var(--accent-glow),transparent 70%),var(--bg);}
        .persona-quote-inner{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(28px,5vw,72px);align-items:center;}
        @media(max-width:880px){.persona-quote-inner{grid-template-columns:1fr;}}
        .persona-quote-card{position:relative;aspect-ratio:1/1;border-radius:var(--radius-lg);background:repeating-linear-gradient(135deg,color-mix(in oklab,var(--accent) 12%,transparent) 0 14px,transparent 14px 30px),var(--bg-elevated);border:1px solid var(--border);overflow:hidden;display:flex;align-items:flex-end;padding:24px;}
        .persona-quote-card::before{content:'"';position:absolute;left:20px;top:-10px;font-family:var(--font-display);font-weight:600;font-size:200px;color:var(--accent);line-height:1;opacity:.2;}
        .persona-quote-card .name{font-family:var(--font-display);font-weight:600;font-size:20px;letter-spacing:-0.015em;color:var(--fg);}
        .persona-quote-card .role{font-size:13px;color:var(--fg-muted);margin-top:4px;}
        .persona-quote-card-inner{z-index:1;}
        .persona-quote-text q{display:block;font-family:var(--font-display);font-weight:600;font-size:clamp(22px,2.6vw,36px);line-height:1.25;letter-spacing:-0.025em;color:var(--fg);text-wrap:pretty;quotes:none;margin:0 0 28px;}
        .persona-quote-text q::before{content:'"';color:var(--accent);padding-right:4px;}
        .persona-quote-text q::after{content:'"';color:var(--accent);padding-left:4px;}
        .persona-quote-attr{font-family:var(--font-label);font-size:13px;letter-spacing:.04em;color:var(--fg-muted);text-transform:uppercase;}
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
        .cs-logos{display:grid;grid-template-columns:repeat(6,1fr);gap:0;border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-elevated);}
        @media(max-width:880px){.cs-logos{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:480px){.cs-logos{grid-template-columns:repeat(2,1fr);}}
        .cs-logo{padding:28px 16px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:600;font-size:18px;letter-spacing:-0.02em;color:var(--fg-muted);border-right:1px solid var(--border);border-bottom:1px solid var(--border);}
        .cs-logo:nth-child(6n){border-right:0;}
        .cs-section{padding:clamp(48px,6vw,80px) 0;}
`

export default function MarketingPage() {
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
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For marketers, content &amp; brand teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Marketing</em> that knows your brand inside out.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for Marketing from Ask the Genie answers any question about your campaigns, content and audience — grounded in your analytics, briefs and past work, with every answer cited. Research faster, stay on-brand, and ship more without reinventing what you already know.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="/#cta">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="/#demo">Schedule Demo</a>
              </div>
            </div>
            <div className="persona-visual hero-anim" role="img" aria-label="Three illustrative marketing answer cards" style={{ animationDelay: '200ms' }}>
              <div className="pv-card pv-card-a">
                <div className="pv-h">Question</div>
                <p className="pv-t">What messaging worked best for our Q1 launch?</p>
                <span className="pv-cite">● Analytics · Docs · Campaigns</span>
              </div>
              <div className="pv-card pv-card-b">
                <div className="pv-h">Answer · 5s</div>
                <p className="pv-t">&ldquo;Ship faster&rdquo; outperformed &ldquo;Save time&rdquo; by 38% CTR. Webinar drove 2.1× pipeline vs. ebook.</p>
                <span className="pv-cite">4 sources cited</span>
                <div className="pv-bar"><i></i></div>
              </div>
              <div className="pv-card pv-card-c">
                <div className="pv-h">Source · GA4 · Q1 report</div>
                <p className="pv-t">Landing variant B — 4.2% CTR vs. 3.0% control · n = 18k</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Marketing — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              AI for Marketing is software that reads everything your marketing team produces — campaign analytics, briefs, brand guidelines, past content and competitor notes — and answers any question about your marketing in plain language, with every claim cited back to the exact source. It turns hours of digging through dashboards and old docs into seconds of grounded, on-brand answers.
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
                </div>
                <div className={`use-visual--img${item.img ? ' has-img' : ''}`} aria-hidden={!item.img}>
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.imgAlt ?? item.placeholder}
                      fill
                      className="use-visual-img-real"
                      style={{ objectFit: 'cover', padding: '12px' }}
                    />
                  ) : (
                    <ImageSlot placeholder={item.placeholder} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="persona-more" aria-labelledby="howto-h">
          <div className="container">
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Marketing: step-by-step.</h2>
            <p className="persona-uses-lede" style={{ marginBottom: 36 }}>
              Getting started takes four steps — no implementation project, no new workflow to learn. Connect your stack, ask about any campaign, verify the source, and roll it out across the marketing team.
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
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Ask the Genie related to AI for Marketing.</h2>
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
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI for Marketing — features, benefits &amp; key capabilities.</h2>
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
              <span className="eyebrow">Benefits for marketers &amp; brand teams</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit" key={i} data-reveal="pop" style={{ '--reveal-delay': `${i * 60}ms` } as any}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
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
                <div className="name">Naomi Ito</div>
                <div className="role">Head of Marketing · Cascade</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">My team used to lose a day every launch digging up what we&apos;d said before and what actually worked. Now we ask one question and get a cited answer in seconds — on-brand, on-message, and backed by our own data.</q>
              <div className="persona-quote-attr">— Cascade · 90-person marketing org · B2B SaaS</div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes marketing teams report.</h2>
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
                  <span className="persona-more-link">{m.link} <ArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO WALL ── */}
        <section className="cs-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up"><span className="eyebrow" id="cs-logos-h">Trusted by marketing teams at</span></div>
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
