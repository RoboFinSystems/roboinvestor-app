export default function PlatformSection() {
  return (
    <section id="platform" className="bg-zinc-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Built on RoboSystems
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            Leveraging a powerful knowledge graph platform for semantic
            investment analysis
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Knowledge Graph */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20">
              <svg
                className="h-7 w-7 text-emerald-400"
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
            <h3 className="mb-3 text-xl font-bold text-white">
              Knowledge Graph
            </h3>
            <p className="mb-4 text-gray-400">
              Store portfolio data as interconnected nodes and relationships.
              Query complex patterns like "Show all holdings in tech sector with
              dividend yield above 3%".
            </p>
            <div className="rounded-lg bg-black/50 p-4 font-mono text-xs text-emerald-400">
              <code>
                MATCH (h:Holding)-[:IN_SECTOR]-&gt;(s:Sector)
                <br />
                WHERE s.name = 'Technology'
                <br />
                AND h.dividend_yield &gt; 0.03
                <br />
                RETURN h.symbol, h.value
              </code>
            </div>
          </div>

          {/* AI Integration */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/20">
              <svg
                className="h-7 w-7 text-teal-400"
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
            <h3 className="mb-3 text-xl font-bold text-white">
              Claude AI Integration
            </h3>
            <p className="mb-4 text-gray-400">
              Natural language queries translated to graph operations. Ask
              questions like "What's my exposure to interest rate risk?" and get
              intelligent analysis.
            </p>
            <div className="space-y-2">
              <div className="rounded-lg bg-black/50 p-3 text-sm text-gray-300">
                "Analyze my tech holdings performance"
              </div>
              <div className="rounded-lg bg-emerald-950/50 p-3 text-sm text-emerald-300">
                AI generates insights from your portfolio data...
              </div>
            </div>
          </div>

          {/* MCP Protocol */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20">
              <svg
                className="h-7 w-7 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">MCP Protocol</h3>
            <p className="mb-4 text-gray-400">
              Connect Claude Desktop or Claude Code directly to your portfolio
              data via Model Context Protocol for seamless AI-powered analysis.
            </p>
            <div className="rounded-lg bg-black/50 p-4 font-mono text-xs text-cyan-400">
              <code>
                {`{`}
                <br />
                &nbsp;&nbsp;"mcpServers": {`{`}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;"roboinvestor": {`{`}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                "@roboinvestor/mcp"]
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{`}`}
                <br />
                &nbsp;&nbsp;{`}`}
                <br />
                {`}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
