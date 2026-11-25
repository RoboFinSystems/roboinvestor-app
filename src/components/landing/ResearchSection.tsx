import { GraphOrb } from '@robosystems/core/graph-stage'
import Link from 'next/link'

const SEC_REPOSITORY_HREF = 'https://robosystems.ai/pricing#sec-repository'
const RESEARCH_HREF = '/research'

// What a research page carries: the brief where there is one, and for every covered filer
// the latest statements, the viewer, the filing's data files and the filing as filed
// (src/components/filings/CompanyPage.tsx links each of them).
const formats = [
  {
    title: 'Written report',
    description:
      'The brief, with every figure traceable to the filing it came from',
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
    title: 'Video and audio',
    description:
      'A narrated walkthrough and the report read aloud, on the briefs that carry them',
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
    title: 'Latest statements',
    description:
      'The balance sheet, income statement and cash flows from the latest filing, rendered from its XBRL',
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
          d="M3 10h18M3 14h18M9 6v12M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
        />
      </svg>
    ),
  },
  {
    title: 'Report viewer',
    description:
      'The whole filing in the xbrlkit viewer: every statement, note and fact',
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
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    title: 'The data',
    description:
      'The filing as a holon (JSON-LD) and a Tavi model, to load into your own tools',
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
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: 'As filed',
    description: 'The original 10-K or 10-Q, and its page on EDGAR',
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
    <section id="research" className="relative bg-black py-16 sm:py-24">
      <GraphOrb side="right" count={1} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-accent-500/20 text-accent-400 mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            Equity Research
          </div>
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Equity research, generated from the filings
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            One public company per report. Every figure traceable to an SEC
            filing. No hype, no price targets. It&apos;s the clearest look at
            what the SEC knowledge graph can do, before you run the same
            analysis yourself.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* What's in every report */}
          <div className="node-card rounded-2xl border border-gray-800 bg-linear-to-br from-zinc-900/80 to-black p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              What a research page gives you
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
          <div className="node-card border-accent-500/30 from-accent-900/20 rounded-2xl border bg-linear-to-br to-zinc-900 p-8">
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
                    Drawn from the same shared repository of 8,000+ public
                    companies: 10-K, 10-Q, 20-F, and 40-F filings, structured as
                    facts you can query.
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
                    Subscribe to the SEC repository (14-day trial, no card
                    needed) and query it in the console, or from Claude, ChatGPT
                    or any MCP client.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent-950/40 mt-6 rounded-lg p-4">
              <div className="text-accent-400 text-sm font-semibold">
                Every report is public
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Read any report without an account. To run the same analysis
                yourself, the SEC repository has a 14-day trial, and no card is
                needed to start it.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={SEC_REPOSITORY_HREF}
            className="from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-lg bg-linear-to-r px-8 py-4 text-center text-lg font-medium text-white shadow-lg transition-all duration-300"
          >
            Try the SEC repository
          </a>
          <Link
            href={RESEARCH_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:border-gray-500 hover:bg-white/5"
          >
            Browse the research
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
