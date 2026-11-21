import { defaultPrompt } from '@/lib/research/prompt'
import Link from 'next/link'
import { CopyPrompt } from './CopyPrompt'

/**
 * The trial block: the step from reading a brief to asking the filing yourself.
 *
 * A brief is made by putting questions to the SEC Shared Repository, so the reader's next
 * step is the same question in their own AI client. The block shows one prompt to copy and
 * one link, to the page where the 14-day trial starts.
 *
 * Copy discipline: it is a trial, never a "free tier" or "free plan", and no price appears
 * here; pricing lives behind the link. The claims are pinned in the test beside this file.
 */

export const TRIAL_HREF = 'https://robosystems.ai/pricing'

export function AskTheFiling({
  company,
  prompt,
}: {
  company: string
  /** The brief's own prompt; a brief without one gets a question that works for any filer. */
  prompt?: string | null
}) {
  const text = prompt || defaultPrompt(company)
  return (
    <section className="mt-12 rounded-xl border border-cyan-500/30 bg-cyan-50/60 p-6 sm:p-8 dark:bg-gray-900/50">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Ask the filing yourself
      </h2>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        Every figure in this report came from {company}&apos;s SEC filings in
        the RoboSystems SEC Shared Repository. Connect it to Claude or ChatGPT
        and ask your own questions, starting with this one:
      </p>
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black/40">
        <p className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100">
          {text}
        </p>
        <CopyPrompt text={text} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={TRIAL_HREF}
          className="from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-lg bg-linear-to-r px-4 py-2 text-sm font-medium text-white shadow-lg transition-all"
        >
          Start the 14-day trial
        </Link>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          No card required.
        </span>
      </div>
    </section>
  )
}

/** The same step, one line, for the research index, where there is no one company to name. */
export function AskTheFilingLine() {
  return (
    <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
      Every report here was made by asking the SEC filings.{' '}
      <Link
        href={TRIAL_HREF}
        className="text-primary-400 font-medium hover:underline"
      >
        Ask them yourself with a 14-day trial
      </Link>
      , no card required.
    </p>
  )
}
