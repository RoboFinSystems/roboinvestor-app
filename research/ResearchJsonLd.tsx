// Schema.org JSON-LD for the research portal. Server component — emits one or more
// <script type="application/ld+json"> blocks derived entirely from the CoverageItem the
// catalog already gives us (no extra fetches). Makes ticker pages eligible for Article,
// Video, Podcast, and Breadcrumb rich results, and the index page for an ItemList carousel.
//
// `baseUrl`/`organization` are props (not hardcoded) so this stays portable across the apps
// that share this subtree; robosystems-app passes its public origin.

import { youtubeId } from './catalog'
import type { CoverageItem } from './types'

type Organization = { name: string; url: string; logo: string }

const DEFAULT_ORG: Organization = {
  name: 'RoboSystems',
  url: 'https://robosystems.ai',
  logo: 'https://robosystems.ai/images/logo_black.png',
}

/** One JSON-LD block. `</` is escaped so report text can never break out of the script. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/**
 * Per-report structured data for `/research/{ticker}`: Article + (when media exists)
 * VideoObject and PodcastEpisode + a BreadcrumbList. `JSON.stringify` drops `undefined`
 * keys, so optional assets simply omit themselves.
 */
export function ResearchJsonLd({
  item,
  baseUrl = DEFAULT_ORG.url,
  organization = DEFAULT_ORG,
}: {
  item: CoverageItem
  baseUrl?: string
  organization?: Organization
}) {
  const url = `${baseUrl}/research/${item.ticker.toLowerCase()}`
  const images = item.assets.thumbnail ? [item.assets.thumbnail] : undefined
  const keywords = item.tags?.length ? item.tags.join(', ') : undefined

  const publisher = {
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: { '@type': 'ImageObject', url: organization.logo },
  }

  const blocks: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      description: item.summary,
      image: images,
      datePublished: item.date,
      dateModified: item.date,
      keywords,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: {
        '@type': 'Organization',
        name: organization.name,
        url: organization.url,
      },
      publisher,
    },
  ]

  const ytId = youtubeId(item.youtube_url)
  if (ytId || item.assets.video) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: item.title,
      description: item.summary,
      thumbnailUrl: images,
      uploadDate: item.date,
      embedUrl: ytId ? `https://www.youtube.com/embed/${ytId}` : undefined,
      contentUrl: item.assets.video || undefined,
      publisher,
    })
  }

  if (item.assets.podcast_mp3) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: item.title,
      url,
      datePublished: item.date,
      associatedMedia: {
        '@type': 'AudioObject',
        contentUrl: item.assets.podcast_mp3,
      },
      partOfSeries: {
        '@type': 'PodcastSeries',
        name: `${organization.name} Research`,
        url: `${baseUrl}/research`,
      },
    })
  }

  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Research',
        item: `${baseUrl}/research`,
      },
      { '@type': 'ListItem', position: 3, name: item.company, item: url },
    ],
  })

  return (
    <>
      {blocks.map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
    </>
  )
}

/** ItemList structured data for the `/research` index — the report hub as a list. */
export function ResearchListJsonLd({
  items,
  baseUrl = DEFAULT_ORG.url,
}: {
  items: CoverageItem[]
  baseUrl?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'RoboSystems Research',
    description:
      'Equity research from the filings — one public company per report.',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${baseUrl}/research/${item.ticker.toLowerCase()}`,
      name: item.title,
    })),
  }
  return <JsonLd data={data} />
}
