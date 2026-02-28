import Link from 'next/link'

const CHECK_ICON = (
  <svg
    className="mr-3 h-5 w-5 shrink-0 text-green-400"
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

interface RepositoryPricingProps {
  isAuthenticated: boolean
  onContactSales: () => void
}

export default function RepositoryPricing({
  isAuthenticated,
  onContactSales,
}: RepositoryPricingProps) {
  return (
    <div className="mb-4">
      <h2 className="mb-3 text-center text-3xl font-bold text-white">
        SEC Shared Repository
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
        Access 100,000+ SEC filings from 4,000+ public companies through an
        intelligent AI agent that understands financial relationships and can
        answer complex queries in natural language.
      </p>
      <div className="mx-auto grid max-w-3xl gap-6 sm:gap-8 md:grid-cols-2">
        {/* Starter */}
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-green-500/30 bg-linear-to-br from-green-900/50 to-green-900/20 p-4 transition-all duration-300 hover:border-green-500/50 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative flex flex-1 flex-col">
            <div className="mb-8">
              <h3 className="font-heading mb-2 text-2xl font-bold text-white">
                Starter
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">
                Full SEC data access for individuals
              </p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                5,000 AI agent credits per month
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                Full SEC data (all companies, all history)
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                Unlimited MCP tool access
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                API access
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                Standard rate limits
              </li>
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                href={isAuthenticated ? '/repositories/browse' : '/register'}
                className="block w-full rounded-lg bg-green-500/80 py-3 text-center font-medium text-white transition-all duration-300 hover:bg-green-600/80"
              >
                {isAuthenticated ? 'Browse Repositories' : 'Get Started'}
              </Link>
              <button
                onClick={onContactSales}
                className="block w-full rounded-lg border border-green-700 py-3 text-center font-medium text-gray-300 transition-all duration-300 hover:bg-green-800/20 hover:text-white"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Pro */}
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-green-500 bg-linear-to-br from-green-900/50 to-green-900/20 p-4 transition-all duration-300 hover:border-green-400 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="absolute -top-1 -right-1 z-10">
            <div className="rounded-bl-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white">
              MOST POPULAR
            </div>
          </div>
          <div className="relative flex flex-1 flex-col">
            <div className="mb-8">
              <h3 className="font-heading mb-2 text-2xl font-bold text-white">
                Pro
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">
                Higher throughput for production workloads
              </p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                17,000 AI agent credits per month
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                Everything in Starter
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                5x higher rate limits
              </li>
              <li className="flex items-start text-gray-300">
                {CHECK_ICON}
                Production-ready throughput
              </li>
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                href={isAuthenticated ? '/repositories/browse' : '/register'}
                className="block w-full rounded-lg bg-green-600 py-3 text-center font-medium text-white transition-all duration-300 hover:bg-green-700"
              >
                {isAuthenticated ? 'Browse Repositories' : 'Get Started'}
              </Link>
              <button
                onClick={onContactSales}
                className="block w-full rounded-lg border border-green-500 py-3 text-center font-medium text-gray-300 transition-all duration-300 hover:bg-green-900/20 hover:text-white"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
