import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CoverageHistory } from './CoverageHistory'
import type { CoverageItem } from './types'

/**
 * The full coverage report: native video, the brief rendered from markdown (its own
 * leading H1 is stripped — we render the title above it), the Q&A podcast, and the
 * continuing-coverage history. Works in a server component (SSR'd for SEO) or a client one.
 * Wrap in a `.dark` container for the marketing site's dark theme.
 */
export function ResearchArticle({
  item,
  briefMarkdown,
}: {
  item: CoverageItem
  briefMarkdown?: string
}) {
  const body = (briefMarkdown || '').replace(/^#\s.*(\r?\n)+/, '')
  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-600 dark:text-cyan-400">
          {item.company} · {item.ticker}
        </span>
        {item.coverage_label && <span>{item.coverage_label}</span>}
        <span>{item.date?.slice(0, 10)}</span>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        {item.title}
      </h1>

      {item.assets.video && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          controls
          poster={item.assets.thumbnail}
          src={item.assets.video}
          className="mb-8 aspect-video w-full rounded-xl bg-black"
        />
      )}

      {body && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      )}

      {item.assets.podcast_mp3 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            Listen — Q&amp;A podcast
          </h2>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={item.assets.podcast_mp3} className="w-full" />
        </section>
      )}

      <CoverageHistory history={item.history} />
    </article>
  )
}
