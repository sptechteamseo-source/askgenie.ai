import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import RobotCursor from '@/components/ui/RobotCursor'

export const metadata: Metadata = {
  title: 'askthegenie.ai — The AI your company actually has the answers for',
  description:
    'Connect Gmail, Drive, Salesforce, Notion, Fathom and 30+ more. askthegenie reads what your company already wrote, then answers with citations you can verify in one click.',
  metadataBase: new URL('https://askthegenie.ai'),
  openGraph: {
    title: 'askthegenie.ai',
    description: 'The AI workspace your team can verify.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* <RobotCursor /> */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
