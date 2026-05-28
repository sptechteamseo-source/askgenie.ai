/**
 * Blog helper utilities shared between server and client.
 */

export interface TocItem {
  id: string
  label: string
}

export interface ProcessedContent {
  html: string
  toc: TocItem[]
}

/** Parse headings from HTML content and auto-add id attributes. */
export function processContent(content: string | null | undefined): ProcessedContent {
  if (!content) return { html: '', toc: [] }

  const toc: TocItem[] = []

  const html = content.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, level: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const id =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 60) || `section-${toc.length}`
      toc.push({ id, label: text })
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    }
  )

  return { html, toc }
}

/** Generate 2-letter uppercase initials from a name */
export function getInitials(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** Format date as "May 21, 2026" — locale-independent, safe for SSR hydration */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** Format date as "May 21" — locale-independent, safe for SSR hydration */
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`
}
