import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RoboInvestor | Portfolio Management Agent',
    short_name: 'RoboInvestor',
    description:
      'AI-powered portfolio management agent — analyze holdings, track performance, and surface investment insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logos/roboinvestor.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
