import type { ReactNode } from 'react'

interface MarkProps {
  children: ReactNode
  label?: string
}

const Mark = ({ children, label }: MarkProps) => (
  <span
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
    aria-label={label}
  >
    {children}
  </span>
)

export const Marks: Record<string, ReactNode> = {
  Gmail: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <rect x="3" y="7" width="26" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="m4 9 12 9 12-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  Outlook: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <rect x="4" y="6" width="14" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="11" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 11h7v10h-7" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Salesforce: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="M9 18a4 4 0 1 1 1.5-7.7A5 5 0 0 1 20 11a4 4 0 0 1 4 7H10a3 3 0 0 1-1-1Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <rect x="6" y="5" width="20" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 10v12M11 10l10 12M21 10v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  HubSpot: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <circle cx="22" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 15V7" stroke="currentColor" strokeWidth="2"/>
      <circle cx="22" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="m18 17-7-4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Fathom: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  ),
  Fireflies: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7 7l2 2M23 23l2 2M7 25l2-2M23 9l2-2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <rect x="6" y="13" width="6" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="20" width="6" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="20" y="13" width="6" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="6" width="6" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Drive: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="m11 5 10 .5L28 19l-5 8H9l-5-8Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="m11 5 6 14M28 19H17M9 27l8-13" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Confluence: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="M4 22c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 12c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Jira: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="M16 4 6 14l4 4 6-6 6 6 4-4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="m16 14-6 6 6 6 6-6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  Linear: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="M5 17 17 5M5 23 23 5M5 11 11 5M11 27 27 11M17 27 27 17" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Zendesk: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <path d="M4 8h12L4 22Z" fill="currentColor"/>
      <path d="M28 22H16L28 8Z" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Asana: (
    <svg viewBox="0 0 32 32" width={24} height={24}>
      <circle cx="16" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="23" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
}
