import FloatingElementsVariant from './FloatingElementsVariant'

export default function AIAnalysisSection() {
  return (
    <section id="ai-analysis" className="relative bg-black py-20">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-900/30 via-teal-900/20 to-black"></div>
      <FloatingElementsVariant variant="ai-analysis" />
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
                  "Compare net income for Apple, Microsoft, and NVIDIA over the
                  last three years"
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
                <div className="mb-2 text-sm text-green-300">AI generates:</div>
                <pre className="overflow-x-auto text-xs text-gray-400">
                  {`MATCH (f:Fact)-[:FACT_HAS_ELEMENT]->
  (el:Element {qname: 'us-gaap:NetIncomeLoss'}),
  (f)-[:FACT_HAS_ENTITY]->(e:Entity),
  (f)-[:FACT_HAS_PERIOD]->(p:Period)
WHERE e.ticker IN ['AAPL','MSFT','NVDA']
  AND p.duration_type = 'annual'
RETURN e.ticker, f.numeric_value, p.end_date
ORDER BY p.end_date DESC`}
                </pre>
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
                Claude AI parses your question, identifies the companies,
                metrics, and time periods you care about
              </p>
            </div>

            <div className="rounded-lg border border-green-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm">
                  2
                </span>
                Text-to-Cypher Translation
              </h4>
              <p className="text-sm text-gray-300">
                Your question is automatically converted into a precise Cypher
                graph query against the SEC XBRL knowledge graph
              </p>
            </div>

            <div className="rounded-lg border border-teal-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm">
                  3
                </span>
                XBRL Data Traversal
              </h4>
              <p className="text-sm text-gray-300">
                The graph engine traverses relationships across filings,
                periods, entities, and financial facts to retrieve structured
                data
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-zinc-900/50 p-6">
              <h4 className="mb-3 flex items-center text-lg font-semibold text-white">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm">
                  4
                </span>
                Summarized Results
              </h4>
              <p className="text-sm text-gray-300">
                Claude interprets the query results and delivers a clear
                narrative with the raw data available for further analysis
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
                "How many companies are in the graph?"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "Show NVIDIA annual revenue for the last 3 years"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "What was Apple's quarterly balance sheet?"
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-zinc-900/50 p-4">
              <p className="text-sm text-gray-300">
                "Show revenue by segment for NVDA"
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
            Connect Claude Desktop or Cursor via MCP for deeper analysis
          </div>
        </div>
      </div>
    </section>
  )
}
