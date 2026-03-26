import { AuthProvider } from '@/lib/core'
import { ThemeModeScript } from 'flowbite-react'
import type { Metadata, Viewport } from 'next'
import { twMerge } from 'tailwind-merge'

import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'RoboInvestor | Portfolio Management Agent',
  description:
    'AI-powered portfolio management agent. Analyze holdings, track performance, and surface investment insights across your portfolio.',
  icons: {
    icon: '/images/logos/roboinvestor.png',
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
      </head>
      <body className={twMerge('bg-zinc-50 font-sans dark:bg-black')}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
