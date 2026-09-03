import { youtubeId } from '@/lib/research/catalog'
import type { CoverageItem } from '@/lib/research/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CoverageHistory } from './CoverageHistory'

/**
 * The full coverage report: native video, the Q&A podcast (a "Listen" card right under
 * the video, rendered from the CDN MP3 only: the YouTube podcast uploads were removed,
 * and the catalog's `podcast_youtube_url` is never embedded), then the brief rendered
 * from markdown (its own
 * leading H1 is stripped — we render the title above it), and the continuing-coverage
 * history. Works in a server component (SSR'd for SEO) or a client one.
 * Theme-aware: readable in both light and dark. The prose body sets an explicit
 * light + `dark:` color for every element it renders (headings, p, strong, em, links,
 * lists, code, blockquote, hr, tables) rather than relying on `prose-invert` /
 * `dark:prose-invert` — the latter doesn't resolve from a `.dark` class in the
 * Tailwind v4 + typography-plugin setup these apps use.
 */
export function ResearchArticle({
  item,
  briefMarkdown,
}: {
  item: CoverageItem
  briefMarkdown?: string
}) {
  const body = (briefMarkdown || '').replace(/^#\s.*(\r?\n)+/, '')
  const ytId = youtubeId(item.youtube_url)
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

      {ytId ? (
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${ytId}`}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        item.assets.video && (
          // eslint-disable-next-line jsx-a11y/media-has-caption -- the pipeline produces no caption track; the brief below is the written report
          <video
            controls
            poster={item.assets.thumbnail}
            src={item.assets.video}
            className="mb-8 aspect-video w-full rounded-xl bg-black"
          />
        )
      )}

      {item.assets.podcast_mp3 && (
        <section className="mb-8">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-50/60 p-4 dark:bg-gray-900/50">
            <p className="mb-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              🎙 Listen — Q&amp;A podcast
            </p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption -- the pipeline produces no transcript track for the Q&A podcast */}
            <audio
              controls
              preload="none"
              src={item.assets.podcast_mp3}
              className="w-full"
            />
          </div>
        </section>
      )}

      {body && (
        <div className="prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-500 dark:hover:prose-a:text-cyan-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-code:text-cyan-700 dark:prose-code:text-cyan-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:italic prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-li:marker:text-cyan-500 prose-hr:border-gray-200 dark:prose-hr:border-gray-800 prose-table:border-gray-300 dark:prose-table:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-900 prose-th:text-gray-900 dark:prose-th:text-white prose-td:text-gray-700 dark:prose-td:text-gray-300 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      )}

      <CoverageHistory history={item.history} />

      <footer className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Audio &amp; music produced with ElevenLabs.
        </p>
        <a
          href="https://elevenlabs.io/startup-grants"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Backed by the ElevenLabs Grants program"
          className="mt-3 inline-block"
        >
          {}
          <img
            src="/images/logos/elevenlabs-grants.webp"
            alt="Backed by the ElevenLabs Grants program"
            width={200}
            className="h-auto dark:hidden"
          />
          {}
          <img
            src="/images/logos/elevenlabs-grants-white.webp"
            alt="Backed by the ElevenLabs Grants program"
            width={200}
            className="hidden h-auto dark:block"
          />
        </a>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Using ElevenLabs yourself? Our{' '}
          <a
            href="https://try.elevenlabs.io/v9z3wzm97gk3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            referral link
          </a>{' '}
          costs you nothing extra and supports this research.
        </p>
      </footer>
    </article>
  )
}
