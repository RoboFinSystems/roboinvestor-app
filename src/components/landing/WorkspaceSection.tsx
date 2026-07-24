import FloatingElementsVariant from './FloatingElementsVariant'

// The three things you actually do in the app once you're inside — reading
// filings, searching them, and seeing your own stake in the same companies.
const capabilities = [
  {
    title: 'Rendered financial statements',
    description:
      'Search a ticker, pick a filing, and read the income statement, balance sheet, and cash flows rendered from the XBRL — structured data, not a PDF scan.',
    color: 'primary',
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
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Full-text and semantic search',
    description:
      'Search across filings and your own uploaded documents, filtered by entity, form type, and fiscal year — keyword matching or meaning-based, your choice.',
    color: 'secondary',
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Holdings grouped by company',
    description:
      'Positions roll up per issuer with cost basis and current value — so a company’s filings and your stake in it sit one click apart.',
    color: 'accent',
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
]

const colorClasses = {
  primary:
    'from-primary-500/10 border-primary-500/30 hover:border-primary-500/50',
  secondary:
    'from-secondary-500/10 border-secondary-500/30 hover:border-secondary-500/50',
  accent: 'from-accent-500/10 border-accent-500/30 hover:border-accent-500/50',
}

const iconClasses = {
  primary: 'bg-primary-500/20 text-primary-400',
  secondary: 'bg-secondary-500/20 text-secondary-400',
  accent: 'bg-accent-500/20 text-accent-400',
}

export default function WorkspaceSection() {
  return (
    <section
      id="workspace"
      className="relative bg-linear-to-b from-zinc-900 to-black py-16 sm:py-24"
    >
      <FloatingElementsVariant variant="workspace" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="bg-secondary-500/20 text-secondary-400 mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            In the App
          </div>
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Read the Filings, Not Just Query Them
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            The console is for questions. The rest of the app is for reading —
            rendered statements, searchable documents, and your holdings against
            the same companies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className={`group rounded-2xl border bg-linear-to-br to-zinc-900 p-6 transition-all duration-300 ${
                colorClasses[capability.color as keyof typeof colorClasses]
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  iconClasses[capability.color as keyof typeof iconClasses]
                }`}
              >
                {capability.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {capability.title}
              </h3>
              <p className="text-sm text-gray-400">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
