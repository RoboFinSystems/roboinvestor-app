import { AuthProvider, customTheme } from '@/lib/core'
import { organizationJsonLd } from '@/lib/structured-data'
import { ThemeModeScript, ThemeProvider } from 'flowbite-react'
import type { Metadata, Viewport } from 'next'
import { twMerge } from 'tailwind-merge'

import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const TITLE = 'RoboInvestor | Portfolio Management Agent'
const DESCRIPTION =
  'AI-powered portfolio management agent. Analyze holdings, track performance, and surface investment insights across your portfolio.'

export const metadata: Metadata = {
  metadataBase: new URL('https://roboinvestor.ai'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roboinvestor.ai',
    siteName: 'RoboInvestor',
    title: TITLE,
    description: DESCRIPTION,
    // og:image comes from the generated app/opengraph-image.tsx (site-wide).
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    // twitter:image comes from the generated app/twitter-image.tsx (site-wide).
    site: '@robofinsystems',
    creator: '@robofinsystems',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className={twMerge('bg-zinc-50 font-sans dark:bg-black')}>
        <ThemeProvider theme={customTheme}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
