const CHECK_ICON = (
  <svg
    className="mr-3 h-5 w-5 shrink-0 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const TIERS = [
  {
    name: 'Standard',
    description: 'Dedicated graph infrastructure to get started',
    features: [
      'AI credits included monthly',
      'Dedicated RAM with subgraphs',
      'Backup retention',
    ],
  },
  {
    name: 'Large',
    description: 'Enhanced performance for growing companies',
    features: [
      'More AI credits monthly',
      'Higher capacity dedicated RAM',
      'Extended backup retention',
    ],
  },
  {
    name: 'XLarge',
    description: 'Maximum performance for data-intensive operations',
    features: [
      'Maximum AI credits monthly',
      'Highest capacity dedicated RAM',
      'Maximum backup retention',
    ],
  },
]

interface GraphPricingProps {
  onContactSales: () => void
}

export default function GraphPricing({ onContactSales }: GraphPricingProps) {
  return (
    <div className="mt-20">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
          Coming Soon
        </div>
        <h2 className="mb-3 text-3xl font-bold text-white">
          Dedicated Graph Infrastructure
        </h2>
        <p className="mx-auto max-w-2xl text-gray-400">
          Deploy your own dedicated knowledge graph with AI-powered analysis.
          Pricing details will be announced soon.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-700 bg-linear-to-br from-gray-800/50 to-gray-900/50 p-4 opacity-75 transition-all duration-300 hover:border-gray-600 hover:opacity-90 sm:p-6 md:p-8"
          >
            <div className="absolute inset-0 bg-linear-to-br from-gray-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative flex-1">
              <div className="mb-8">
                <h3 className="font-heading mb-2 text-2xl font-bold text-white">
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-400">
                    Pricing TBD
                  </span>
                </div>
                <p className="text-gray-500">{tier.description}</p>
              </div>
              <ul className="mb-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start text-gray-400">
                    {CHECK_ICON}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onContactSales}
              className="block w-full rounded-lg border border-gray-600 py-3 text-center font-medium text-gray-400 transition-all duration-300 hover:bg-gray-800 hover:text-white"
            >
              Contact Sales
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
