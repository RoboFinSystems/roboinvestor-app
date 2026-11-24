import { Dust, GraphGalaxies } from '@robosystems/core/graph-stage'

// The section reads left to right as one flow: what comes in, what it becomes,
// what gets done to it, and where it is reached from. The second column is the
// schema drawn as the graph it is: your portfolio, joined to the public filings.

const SOURCES = [
  {
    name: 'Your positions',
    kind: 'Entered by you',
    lines: [
      'Private equity and venture stakes',
      'SAFEs, notes, LLC units and LP interests',
    ],
  },
  {
    name: 'SEC repository',
    kind: 'Public filings',
    lines: [
      '8,000+ public companies',
      '10-K, 10-Q, 20-F and 40-F, as XBRL facts and text',
    ],
  },
  {
    name: 'Shared reports',
    kind: 'From a company',
    lines: [
      "Statements from a company's own ledger",
      'Shared when both sides opt in',
    ],
  },
]

// Tools carry the names they have in the app and in an MCP client.
const JOBS = [
  {
    job: 'Track',
    does: 'Portfolios, positions and cost basis; each change applies whole or not at all.',
    tools: ['Create Portfolio Block', 'Update Portfolio Block'],
  },
  {
    job: 'Describe',
    does: 'Each instrument and its terms, linked to the company that issued it.',
    tools: ['Create Security', 'Create Issuer'],
  },
  {
    job: 'Read filings',
    does: "A company's statements and notes, straight from its filing.",
    tools: ['Financial Statement Analysis', 'Disclosures', 'Information Block'],
  },
  {
    job: 'Compare',
    does: 'One measure across companies and periods, side by side.',
    tools: ['Build Fact Grid'],
  },
  {
    job: 'Search',
    does: 'Find where a filing says something, then read it in place.',
    tools: ['Search Text', 'Read Text', 'Describe Filing'],
  },
  {
    job: 'Receive',
    does: 'A private company sends its statements; they arrive as a report beside your position.',
    tools: ['Ingest Report'],
  },
]

const ACCESS: {
  name: string
  line: string
  formats?: string[]
  link?: { label: string; href: string }
}[] = [
  {
    name: 'RoboInvestor app',
    line: 'Portfolios and an SEC research console, in a browser',
  },
  {
    name: 'Your AI',
    line: 'The same tools from Claude, ChatGPT or any MCP client',
  },
  {
    name: 'API',
    line: 'GraphQL and REST, with Python and TypeScript clients',
  },
  {
    name: 'Filing files',
    line: 'Every filing is a file you can download and open without us',
    formats: ['Holon (RDF)', 'Tavi JSON', 'As filed'],
    link: {
      label: 'Open one in the xbrlkit viewer',
      href: 'https://xbrlkit.com',
    },
  },
]

type Tone = 1 | 2 | 3
const tone = (n: Tone, alpha = 1) => `rgb(var(--graph-${n}) / ${alpha})`

// The schema graph's nodes, on a 420 x 560 canvas: your graph above, the SEC
// repository below, joined where an issuer is a filer.
const NODES: {
  id: string
  label: string
  sub: string
  x: number
  y: number
  tone: Tone
}[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    sub: 'a fund or account',
    x: 95,
    y: 92,
    tone: 1,
  },
  {
    id: 'position',
    label: 'Position',
    sub: 'units and cost basis',
    x: 305,
    y: 92,
    tone: 1,
  },
  {
    id: 'issuer',
    label: 'Issuer',
    sub: 'the company behind it',
    x: 95,
    y: 196,
    tone: 2,
  },
  {
    id: 'security',
    label: 'Security',
    sub: 'instrument and terms',
    x: 305,
    y: 196,
    tone: 2,
  },
  {
    id: 'company',
    label: 'Company',
    sub: 'a public filer',
    x: 95,
    y: 350,
    tone: 3,
  },
  {
    id: 'filing',
    label: 'Filing',
    sub: '10-K, 10-Q, 20-F, 40-F',
    x: 305,
    y: 350,
    tone: 3,
  },
  {
    id: 'industry',
    label: 'Industry',
    sub: 'its peers',
    x: 95,
    y: 454,
    tone: 3,
  },
  {
    id: 'fact',
    label: 'Fact',
    sub: 'a reported figure',
    x: 305,
    y: 454,
    tone: 3,
  },
]

const EDGES: {
  from: string
  to: string
  label: string
  dx?: number
  dy?: number
}[] = [
  { from: 'portfolio', to: 'position', label: 'holds', dy: -8 },
  { from: 'position', to: 'security', label: 'in', dx: 14, dy: 4 },
  { from: 'security', to: 'issuer', label: 'issued by', dy: -8 },
  { from: 'issuer', to: 'company', label: 'where it files', dx: 52, dy: 4 },
  { from: 'company', to: 'filing', label: 'files', dy: -8 },
  { from: 'filing', to: 'fact', label: 'reports', dx: 30, dy: 4 },
  { from: 'company', to: 'industry', label: 'placed in', dx: 36, dy: 4 },
]

// The two graphs the nodes sit in.
const FRAMES = [
  { label: 'Your graph', x: 6, y: 34, w: 404, h: 204, end: false },
  { label: 'SEC repository', x: 6, y: 292, w: 404, h: 204, end: true },
]

const NODE_W = 150
const NODE_H = 54

function SchemaGraph() {
  const at = (id: string) => NODES.find((n) => n.id === id)!
  return (
    <svg
      viewBox="0 0 420 510"
      role="img"
      aria-label="The schema, in two graphs. In your graph, a portfolio holds a position in a security, and the security is issued by an issuer. Where the issuer files with the SEC it is the same company in the SEC repository, which files filings that report facts and is placed in an industry."
      className="mx-auto h-auto w-full max-w-md"
    >
      <defs>
        <marker
          id="schema-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="rgb(156 163 175 / 0.8)" />
        </marker>
      </defs>
      {FRAMES.map((frame) => (
        <g key={frame.label}>
          <rect
            x={frame.x}
            y={frame.y}
            width={frame.w}
            height={frame.h}
            rx="16"
            fill="rgb(17 17 20)"
            stroke="rgb(113 113 122 / 0.7)"
            strokeWidth="1.25"
          />
          <text
            x={frame.end ? frame.x + frame.w - 14 : frame.x + 14}
            y={frame.y - 9}
            textAnchor={frame.end ? 'end' : 'start'}
            className="fill-gray-300 text-[12px] font-semibold tracking-wide uppercase"
          >
            {frame.label}
          </text>
        </g>
      ))}
      {EDGES.map((edge) => {
        const a = at(edge.from)
        const b = at(edge.to)
        // Leave each node at its edge, not its centre.
        const dx = b.x - a.x
        const dy = b.y - a.y
        const horizontal = Math.abs(dx) / NODE_W > Math.abs(dy) / NODE_H
        const ox = horizontal ? (Math.sign(dx) * NODE_W) / 2 : 0
        const oy = horizontal ? 0 : (Math.sign(dy) * NODE_H) / 2
        const x1 = a.x + ox
        const y1 = a.y + oy
        const x2 = b.x - ox
        const y2 = b.y - oy
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(156 163 175 / 0.5)"
              strokeWidth="1.5"
              markerEnd="url(#schema-arrow)"
            />
            <text
              x={(x1 + x2) / 2 + (edge.dx ?? 0)}
              y={(y1 + y2) / 2 + (edge.dy ?? 0)}
              textAnchor="middle"
              className="fill-gray-300 text-[12px]"
            >
              {edge.label}
            </text>
          </g>
        )
      })}
      {NODES.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x - NODE_W / 2}
            y={node.y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx="11"
            fill={tone(node.tone, 0.14)}
            stroke={tone(node.tone, 0.6)}
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y - 3}
            textAnchor="middle"
            className="fill-white text-[15px] font-semibold"
          >
            {node.label}
          </text>
          <text
            x={node.x}
            y={node.y + 15}
            textAnchor="middle"
            className="fill-gray-400 text-[11.5px]"
          >
            {node.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 text-xs text-gray-300">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function InvestorSchemaSection() {
  return (
    <section id="schema" className="relative bg-black py-16 sm:py-24">
      <Dust />
      <GraphGalaxies count={3} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Powered by RoboSystems
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            RoboInvestor runs on RoboSystems, the open-source knowledge graph
            for finance: your positions and the companies that issue them, read
            side by side with the public filings.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-zinc-900 to-black p-6 sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr_1.35fr_1fr] lg:gap-8">
            <Step n={1} title="Comes in">
              <div className="space-y-3">
                {SOURCES.map((source) => (
                  <div
                    key={source.name}
                    className="rounded-lg border border-gray-800 bg-zinc-900/60 p-3"
                  >
                    <div className="font-semibold text-white">
                      {source.name}
                    </div>
                    <div className="text-primary-300 mb-1 text-xs">
                      {source.kind}
                    </div>
                    <ul className="space-y-0.5 text-xs text-gray-400">
                      {source.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Step>

            <Step n={2} title="Becomes one graph">
              <SchemaGraph />
              <p className="mt-4 text-center text-xs text-gray-400">
                A position leads to its security, its issuer and, where the
                issuer is public, to every figure it has filed.
              </p>
            </Step>

            <Step n={3} title="Gets done">
              <div className="space-y-3">
                {JOBS.map((item) => (
                  <div
                    key={item.job}
                    className="rounded-lg border border-gray-800 bg-zinc-900/60 p-3"
                  >
                    <div className="font-semibold text-white">{item.job}</div>
                    <p className="mb-2 text-xs text-gray-400">{item.does}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-primary-900/40 text-primary-200 rounded px-2 py-0.5 text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Step>

            <Step n={4} title="Reached from">
              <div className="space-y-3">
                {ACCESS.map((way) => (
                  <div
                    key={way.name}
                    className="rounded-lg border border-gray-800 bg-zinc-900/60 p-3"
                  >
                    <div className="font-semibold text-white">{way.name}</div>
                    <p className="text-xs text-gray-400">{way.line}</p>
                    {way.formats && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {way.formats.map((format) => (
                          <span
                            key={format}
                            className="bg-primary-900/40 text-primary-200 rounded px-2 py-0.5 text-xs"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    )}
                    {way.link && (
                      <a
                        href={way.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-300 hover:text-primary-200 mt-2 inline-block text-xs underline underline-offset-2"
                      >
                        {way.link.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Step>
          </div>
        </div>
      </div>
    </section>
  )
}
