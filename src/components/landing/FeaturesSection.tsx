export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="h-6 w-6"
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
      ),
      title: 'Position Management',
      description:
        'Track holdings with cost basis, market value, and unrealized gains across all accounts',
      color: 'emerald',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
      title: 'Trade History',
      description:
        'Complete transaction log with buy/sell trades, settlement dates, and commission tracking',
      color: 'teal',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: 'Risk Metrics',
      description:
        'Beta, volatility, VaR, and portfolio risk assessments with market correlation analysis',
      color: 'cyan',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Dividend Income',
      description:
        'Track dividend payments, ex-dates, and yield analysis with reinvestment planning',
      color: 'green',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: 'Benchmark Comparison',
      description:
        'Compare portfolio performance against S&P 500, custom indices, and peer strategies',
      color: 'orange',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
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
      ),
      title: 'AI Research Console',
      description:
        'Claude-powered natural language queries for deep portfolio analysis and insights',
      color: 'purple',
    },
  ]

  const colorClasses = {
    emerald:
      'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400',
    teal: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 hover:border-teal-500/50 text-teal-400',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400',
    green:
      'from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50 text-green-400',
    orange:
      'from-orange-500/20 to-amber-500/20 border-orange-500/30 hover:border-orange-500/50 text-orange-400',
    purple:
      'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-400',
  }

  return (
    <section
      id="features"
      className="relative bg-gradient-to-b from-black to-zinc-900 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            The Open Source Investment Platform
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            Build, customize, and deploy intelligent investment applications
          </p>
        </div>

        {/* Framework vs Application Comparison */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Traditional Apps */}
          <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900/50 to-zinc-900 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500/20">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Closed Investment Platforms
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-500/20 text-sm font-semibold text-gray-400">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Limited Customization
                  </div>
                  <p className="text-sm text-gray-400">
                    Locked into vendor features, can't modify analysis or
                    reporting
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-500/20 text-sm font-semibold text-gray-400">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Expensive Subscriptions
                  </div>
                  <p className="text-sm text-gray-400">
                    Monthly fees for basic features, premium tiers for
                    everything useful
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-500/20 text-sm font-semibold text-gray-400">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">Data Lock-in</div>
                  <p className="text-sm text-gray-400">
                    Your portfolio data trapped in proprietary formats
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RoboInvestor Framework */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-zinc-900 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg
                  className="h-6 w-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l2-2m2-2l2-2m-2 2l-2-2m2 2l2 2m7-8a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                RoboInvestor Framework
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Fully Customizable
                  </div>
                  <p className="text-sm text-gray-400">
                    Fork, modify, and deploy your own investment tools
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">
                    AI-Native Architecture
                  </div>
                  <p className="text-sm text-gray-400">
                    Built for Claude integration from the ground up
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Open Data Format
                  </div>
                  <p className="text-sm text-gray-400">
                    Knowledge graph storage, export anything, integrate anywhere
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-emerald-950/50 p-4">
              <div className="text-sm font-semibold text-emerald-400">
                MIT Licensed
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Use commercially, modify freely, contribute back to the
                community
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-${feature.color}-500/20`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
