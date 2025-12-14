export default function InvestorSchemaSection() {
  return (
    <section id="schema" className="relative bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Powered by RoboSystems
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            RoboInvestor runs on the RoboSystems knowledge graph platform,
            organizing your investment data into the RoboInvestor schema for
            intelligent portfolio analysis
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-gray-800 bg-gradient-to-b from-zinc-900 to-black p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Data Sources */}
            <div>
              <h3 className="mb-6 text-center text-sm font-semibold tracking-wider text-gray-500 uppercase">
                Data Sources
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                      <span className="text-xs font-bold text-white">PL</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Plaid</div>
                      <div className="text-xs text-gray-400">Brokerage</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Investment accounts</li>
                    <li>• Holdings & positions</li>
                    <li>• Transaction history</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                      <span className="text-xs font-bold text-white">RS</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        Shared Repository
                      </div>
                      <div className="text-xs text-gray-400">Market Data</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Point-in-time factors</li>
                    <li>• Historical OHLCV</li>
                    <li>• Real-time quotes</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600">
                      <span className="text-xs font-bold text-white">FI</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">FIGI</div>
                      <div className="text-xs text-gray-400">Securities</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Security identifiers</li>
                    <li>• Exchange mappings</li>
                    <li>• Instrument types</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RoboInvestor Schema */}
            <div className="relative">
              <h3 className="mb-6 text-center text-sm font-semibold tracking-wider text-gray-500 uppercase">
                RoboInvestor Schema
              </h3>
              <div className="relative mx-auto mt-8 h-72 w-72">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-teal-600/10">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mb-1 text-sm font-semibold text-white">
                          <div>RoboInvestor Schema</div>
                          <div>Knowledge Graph</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Portfolio + Market data semantics
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-emerald-300">
                      Portfolio Layer
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Portfolios, positions, allocations, benchmarks
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {['Portfolio', 'Position', 'Benchmark'].map(
                      (comp, cidx) => (
                        <span
                          key={cidx}
                          className="rounded bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300"
                        >
                          {comp}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-teal-500/30 bg-teal-950/20 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-teal-300">
                      Securities Layer
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Instruments, market data, dividends
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {['Security', 'MarketData', 'Dividend'].map(
                      (comp, cidx) => (
                        <span
                          key={cidx}
                          className="rounded bg-teal-900/50 px-2 py-0.5 text-xs text-teal-300"
                        >
                          {comp}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-cyan-300">
                      Activity Layer
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Trades, risk metrics, performance
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {['Trade', 'Risk', 'Performance'].map((comp, cidx) => (
                      <span
                        key={cidx}
                        className="rounded bg-cyan-900/50 px-2 py-0.5 text-xs text-cyan-300"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div>
              <h3 className="mb-6 text-center text-sm font-semibold tracking-wider text-gray-500 uppercase">
                Applications
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-gradient-to-br from-zinc-900 to-emerald-950/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="font-semibold text-white">
                      RoboInvestor App
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Portfolio tracking and investment analysis
                  </p>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gradient-to-br from-zinc-900 to-teal-950/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="font-semibold text-white">AI Agents</div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Claude AI with MCP-powered analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-xl border border-gray-800 bg-gradient-to-br from-emerald-500/10 to-zinc-900 p-6 transition-all hover:border-emerald-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Real-Time Sync
            </h3>
            <p className="text-sm text-gray-400">
              Automated data synchronization from brokerage accounts and market
              feeds
            </p>
          </div>

          <div className="group rounded-xl border border-gray-800 bg-gradient-to-br from-teal-500/10 to-zinc-900 p-6 transition-all hover:border-teal-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Unified Data Model
            </h3>
            <p className="text-sm text-gray-400">
              Single source of truth connecting portfolios, securities, and
              market data
            </p>
          </div>

          <div className="group rounded-xl border border-gray-800 bg-gradient-to-br from-cyan-500/10 to-zinc-900 p-6 transition-all hover:border-cyan-500/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Graph Query Performance
            </h3>
            <p className="text-sm text-gray-400">
              Millisecond queries on complex portfolio relationships powered by
              knowledge graph technology
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
