import Link from 'next/link'
import FloatingElementsVariant from './FloatingElementsVariant'

const REGISTER_HREF = '/register'

// What every report bundles together.
const formats = [
  {
    title: 'Video brief',
    description:
      'A narrated walkthrough of the quarter — the numbers and what moved them',
    color: 'primary',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Written report',
    description:
      'The full brief in markdown — every figure traceable to the filing it came from',
    color: 'secondary',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Q&A podcast',
    description:
      'A conversational deep-dive that pressure-tests the thesis from both sides',
    color: 'accent',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-4a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
  },
  {
    title: 'Continuing coverage',
    description:
      'We revisit each company every quarter — the full report history stays one click away',
    color: 'primary',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
]

const colorClasses = {
  primary: 'bg-primary-500/10 text-primary-400',
  secondary: 'bg-secondary-500/10 text-secondary-400',
  accent: 'bg-accent-500/10 text-accent-400',
}

export default function ResearchSection() {
  return (
    <section
      id="research"
      className="relative bg-linear-to-b from-black to-zinc-900 py-16 sm:py-24"
    >
      <FloatingElementsVariant variant="research" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-accent-500/20 text-accent-400 mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            Equity Research
          </div>
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Equity Research, Generated From the Filings
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            One public company per report. Every figure traceable to an SEC
            filing — no hype, no price targets. It&apos;s the clearest look at
            what the SEC knowledge graph can do, before you run the same
            analysis yourself.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* What's in every report */}
          <div className="rounded-2xl border border-gray-800 bg-linear-to-br from-zinc-900/80 to-black p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              What&apos;s in every report
            </h3>
            <div className="space-y-5">
              {formats.map((format) => (
                <div key={format.title} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClasses[format.color as keyof typeof colorClasses]}`}
                  >
                    {format.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {format.title}
                    </div>
                    <p className="text-sm text-gray-400">
                      {format.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Powered by the SEC repository */}
          <div className="border-accent-500/30 from-accent-900/20 rounded-2xl border bg-linear-to-br to-zinc-900 p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Powered by the shared SEC repository
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-accent-500/20 text-accent-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Built on the SEC XBRL knowledge graph
                  </div>
                  <p className="text-sm text-gray-400">
                    Drawn from the same shared repository of 10,000+ public
                    companies — 10-K, 10-Q, and 8-K filings, structured as facts
                    you can query.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-accent-500/20 text-accent-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Every number ties back to a filing
                  </div>
                  <p className="text-sm text-gray-400">
                    No black box. Each figure in the brief traces to the exact
                    XBRL fact it was pulled from.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-accent-500/20 text-accent-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Run the same analysis yourself
                  </div>
                  <p className="text-sm text-gray-400">
                    Subscribe to the shared SEC repository and query it directly
                    in the console — or from Claude Desktop and Cursor over MCP.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent-950/40 mt-6 rounded-lg p-4">
              <div className="text-accent-400 text-sm font-semibold">
                Free to read with an account
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Reports are available to every registered member — the SEC
                repository powers both the research and your own queries.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={REGISTER_HREF}
            className="from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-lg bg-linear-to-r px-8 py-4 text-center text-lg font-medium text-white shadow-lg transition-all duration-300"
          >
            Create free account
          </Link>
          <Link
            href={REGISTER_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:border-gray-500 hover:bg-white/5"
          >
            Explore the SEC repository
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
