import { releasedCohortSitemaps } from '@/lib/research-site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Everything below is authenticated product surface (the (app) route group) —
      // no SEO value and login-gated, so keep crawlers off it. /research is public
      // (the (blog) route group) and stays crawlable; its canonical says who owns it.
      disallow: [
        '/api/',
        '/console/',
        '/entities/',
        '/entity/',
        '/graphs/',
        '/home/',
        '/portfolio/',
        '/repositories/',
        '/search/',
        '/settings/',
      ],
    },
    // The hand-made coverage, then one sitemap per released cohort of generated filer
    // pages (src/lib/research-site.ts); at zero cohorts this is the one file it always was.
    sitemap: [
      'https://roboinvestor.ai/sitemap.xml',
      ...releasedCohortSitemaps(),
    ],
  }
}
