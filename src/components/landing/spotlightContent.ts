import type { Spotlight } from './Spotlights'

// The fund's own lane, for the GP: the positions it holds and the reports its companies share.
export const fundSpotlights: Spotlight[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    title: 'Every private position, grouped by company',
    description:
      'Preferred stock, SAFEs, LLC units, and warrants, each with its own terms, rolled up by issuer with cost basis and current value. Add a position, re-mark one, or record an exit from your AI chat in one update.',
    bullets: [
      'LLC units, LP interests, SAFEs, notes, warrants, options, and RSUs, with liquidation preference, cap, strike, and vesting terms',
      'Holdings grouped by issuer, with cost basis, current value, and the source of each mark',
      'Portfolio changes apply as one envelope: validated up front, rolled back on any failure',
    ],
    caption: 'Portfolio',
    demo: 'portfolio',
    demoLabel:
      'A portfolio update from the AI chat adds an LLC position and a warrant, re-marks the Series A to a new 409A, and records an exit, while the fund totals follow.',
  },
  {
    id: 'reports',
    label: 'Portfolio reports',
    title: 'Reports that arrive as data, not PDFs',
    description:
      "When a portfolio company keeps its books on RoboLedger, it shares its reports straight into your fund's graph. Open them rendered, and ask about them in plain English.",
    bullets: [
      "Link a holding to its issuer's graph, and the link resolves when the company shares",
      "Both sides opt in: you name the company's graph, and the company names your fund's",
      'Statements in the same taxonomy as every public filer, so a comparison needs no remapping',
    ],
    caption: 'Portfolio Reports',
    demo: 'reports',
    demoLabel:
      "A portfolio company's annual report arriving in Portfolio Reports, opening rendered, and answering why cash fell.",
  },
]

// The public-company lane, for anyone researching filers: nothing here needs a fund.
export const researchSpotlights: Spotlight[] = [
  {
    id: 'filings',
    label: 'Research',
    title: "Read any public company's filings",
    description:
      'Search a ticker, pick a filing, and read the income statement, balance sheet, and cash flows rendered from the XBRL. Structured data, not a PDF scan.',
    bullets: [
      '8,000+ public companies: 10-K, 10-Q, 20-F, and 40-F filings',
      'Comparative periods side by side, as the filer presented them',
      'Every figure traces back to the XBRL fact it came from',
    ],
    caption: 'Research',
    demo: 'research',
    demoLabel:
      "A ticker typed into Research and Box's latest 10-K income statement rendered from its XBRL.",
  },
  {
    id: 'console',
    label: 'Natural language',
    title: 'Ask the filings in plain English',
    description:
      'Ask a question and the Analyst Operator picks the right tool for it: a curated financial statement, a filing search, or a Cypher query it writes against the SEC knowledge graph.',
    bullets: [
      'Compare companies, periods, and metrics in one question',
      'See each tool call it makes, and get the result as a table',
      'The same tools answer from Claude, ChatGPT, or any MCP client',
    ],
    caption: 'Console',
    demo: 'console',
    demoLabel:
      'The Console comparing gross margin for Asana, Box and Domo from their latest 10-Ks.',
  },
  {
    id: 'search',
    label: 'Document search',
    title: 'Search the filings by meaning',
    description:
      'Search across filings and your own uploaded documents, filtered by entity, form type, and fiscal year. Match keywords, or search by meaning when the words differ.',
    bullets: [
      'Risk factors, MD&A, and every tagged disclosure note',
      'Semantic search finds the passage even when the filer phrased it differently',
      'Your own documents sit in the same search',
    ],
    caption: 'Search',
    demo: 'search',
    demoLabel:
      'A semantic search for customers moving from per-seat to usage-based pricing, returning passages from two 10-K risk factor sections.',
  },
]
