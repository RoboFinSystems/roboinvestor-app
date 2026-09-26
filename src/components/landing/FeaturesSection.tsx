import FloatingElementsVariant from './FloatingElementsVariant'

export default function FeaturesSection() {
  return (
    <section
      id="open-source"
      className="relative bg-linear-to-b from-black to-zinc-900 py-16 sm:py-24"
    >
      <FloatingElementsVariant variant="features" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="rounded-2xl border border-gray-700 bg-linear-to-br from-gray-900/50 to-zinc-900 p-8">
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
          <div className="border-primary-500/30 from-primary-900/20 rounded-2xl border bg-linear-to-br to-zinc-900 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary-500/20 flex h-12 w-12 items-center justify-center rounded-lg">
                <svg
                  className="text-primary-400 h-6 w-6"
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
                <div className="bg-primary-500/20 text-primary-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
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
                <div className="bg-primary-500/20 text-primary-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white">
                    AI-Native Architecture
                  </div>
                  <p className="text-sm text-gray-400">
                    Built for MCP clients from the ground up
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-500/20 text-primary-400 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
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

            <div className="bg-primary-950/50 mt-6 rounded-lg p-4">
              <div className="text-primary-400 text-sm font-semibold">
                Apache 2.0 Licensed
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Open source — fork it, self-host it, make it yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
