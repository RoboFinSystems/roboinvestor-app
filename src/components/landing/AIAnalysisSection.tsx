export default function AIAnalysisSection() {
  return (
    <section id="ai-analysis" className="relative bg-black py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-black"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-400">
            Intelligent Analysis
          </div>
          <h2 className="font-heading mb-6 text-4xl font-bold text-white md:text-5xl">
            AI-Powered Investment Insights
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Ask questions in natural language and get intelligent analysis of
            your portfolio, market trends, and investment opportunities.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Query Example */}
          <div className="rounded-xl border border-teal-500/30 bg-zinc-900/50 p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">
              From Question to Insight in Seconds
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="rounded-lg bg-black/30 p-4">
                <div className="mb-2 text-sm text-teal-300">You ask:</div>
                <p className="italic">
                  "What's my portfolio's exposure to interest rate risk?"
                </p>
              </div>
              <div className="flex justify-center">
                <svg
                  className="h-8 w-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <div className="rounded-lg bg-black/30 p-4">
                <div className="mb-2 text-sm text-green-300">AI analyzes:</div>
                <ul className="space-y-1 text-sm">
                  <li>
                    • Sector allocation to rate-sensitive holdings (Financials,
                    REITs, Utilities)
                  </li>
                  <li>• Duration analysis of bond positions</li>
                  <li>• Historical performance during rate changes</li>
                  <li>• Recommended hedging strategies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-6">
            <div className="rounded-lg border border-teal-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm">
                  1
                </span>
                Natural Language Understanding
              </h4>
              <p className="text-sm text-gray-300">
                Claude AI interprets your question and identifies relevant
                portfolio data, securities, and analysis requirements
              </p>
            </div>

            <div className="rounded-lg border border-green-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm">
                  2
                </span>
                Graph-Powered Discovery
              </h4>
              <p className="text-sm text-gray-300">
                AI traverses your investment knowledge graph to find related
                holdings, sectors, and market relationships
              </p>
            </div>

            <div className="rounded-lg border border-teal-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm">
                  3
                </span>
                Risk-Aware Analysis
              </h4>
              <p className="text-sm text-gray-300">
                Built-in financial guardrails ensure analysis considers risk
                metrics, diversification, and regulatory constraints
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm">
                  4
                </span>
                Actionable Insights
              </h4>
              <p className="text-sm text-gray-300">
                Receive specific recommendations with supporting data, charts,
                and drill-down capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mt-12">
          <h3 className="mb-6 text-center text-lg font-semibold text-white">
            Example Questions
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "Show my top performers this quarter"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "What dividends am I expecting next month?"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "Compare my tech holdings to the S&P 500"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "Suggest rebalancing for my target allocation"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-300">
            Powered by{' '}
            <span className="font-semibold text-emerald-400">Claude AI</span>{' '}
            and{' '}
            <a
              href="https://robosystems.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              RoboSystems'
            </a>{' '}
            knowledge graph platform
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/40 px-6 py-3 text-sm text-gray-300">
            <svg
              className="h-5 w-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Connect Claude Desktop via MCP for local portfolio analysis
          </div>
        </div>
      </div>
    </section>
  )
}
