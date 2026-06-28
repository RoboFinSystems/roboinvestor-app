import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Everything below is authenticated product surface (the (app) route group) —
      // no SEO value and login-gated, so keep crawlers off it.
      disallow: [
        '/api/',
        '/console/',
        '/entities/',
        '/entity/',
        '/graphs/',
        '/home/',
        '/portfolio/',
        '/repositories/',
        '/research/',
        '/search/',
        '/settings/',
      ],
    },
    sitemap: 'https://roboinvestor.ai/sitemap.xml',
  }
}
