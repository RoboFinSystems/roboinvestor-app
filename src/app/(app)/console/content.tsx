'use client'

import { ConsoleContent, type ConsoleConfig } from '@/lib/core'

const ROBOINVESTOR_CONSOLE_CONFIG: ConsoleConfig = {
  header: {
    title: 'RoboInvestor Console',
    subtitle: 'Text-to-Cypher for SEC financial filings',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
  },
  welcome: {
    consoleName: 'RoboInvestor Console',
    description:
      'Ask questions in plain English and get Cypher queries generated automatically. The SEC graph contains filings from over 10,000 public companies.',
    contextLabel: 'Graph',
    naturalLanguageExamples: [
      'How many nodes are in the graph?',
      'How many companies are in the graph?',
      'How many facts are in the latest report?',
      'What was the last report filed?',
    ],
    directQueryExamples: [
      'MATCH (n) RETURN labels(n), count(n) ORDER BY count(n) DESC',
      "MATCH (e:Entity) WHERE e.ticker = 'AAPL' RETURN e",
      'MATCH (e:Entity) RETURN e.ticker, e.name, e.industry LIMIT 10',
    ],
    closingMessage: 'How can I help you analyze your investments today?',
  },
  mcp: {
    serverName: 'robosystems',
    packageName: '@robosystems/mcp',
    exampleQuestions: [
      'Compare Tesla and Ford revenue trends',
      'Which companies in the graph have the most cash on hand?',
      'Show me Microsoft earnings per share over time',
    ],
    contextIdFallback: 'your_graph_id',
  },
  sampleQueries: [
    {
      name: 'Graph overview',
      query: `MATCH (n)
RETURN labels(n) AS label, count(n) AS count
ORDER BY count DESC`,
    },
    {
      name: 'Companies by industry',
      query: `MATCH (e:Entity)
WHERE e.industry IS NOT NULL
RETURN e.industry, count(e) AS company_count
ORDER BY company_count DESC
LIMIT 15`,
    },
    {
      name: 'NVIDIA annual revenue',
      query: `MATCH (f:Fact {has_dimensions: false})-[:FACT_HAS_ELEMENT]->(el:Element {qname: 'us-gaap:Revenues'}),
      (f)-[:FACT_HAS_ENTITY]->(e:Entity),
      (f)-[:FACT_HAS_PERIOD]->(p:Period)
WHERE e.ticker = 'NVDA' AND p.duration_type = 'annual'
RETURN DISTINCT e.ticker, f.numeric_value, p.end_date
ORDER BY p.end_date DESC`,
    },
    {
      name: 'Compare net income across tech companies',
      query: `MATCH (f:Fact {has_dimensions: false})-[:FACT_HAS_ELEMENT]->(el:Element {qname: 'us-gaap:NetIncomeLoss'}),
      (f)-[:FACT_HAS_ENTITY]->(e:Entity),
      (f)-[:FACT_HAS_PERIOD]->(p:Period)
WHERE e.ticker IN ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META'] AND p.duration_type = 'annual'
RETURN DISTINCT e.ticker, f.numeric_value, p.end_date
ORDER BY p.end_date DESC, f.numeric_value DESC
LIMIT 20`,
    },
    {
      name: 'Apple balance sheet by quarter',
      query: `MATCH (f:Fact {has_dimensions: false})-[:FACT_HAS_ELEMENT]->(el:Element),
      (f)-[:FACT_HAS_ENTITY]->(e:Entity),
      (f)-[:FACT_HAS_PERIOD]->(p:Period)
WHERE e.ticker = 'AAPL'
  AND el.qname IN ['us-gaap:Assets', 'us-gaap:Liabilities', 'us-gaap:StockholdersEquity']
  AND p.period_type = 'instant'
RETURN DISTINCT el.name, f.numeric_value, p.end_date
ORDER BY p.end_date DESC, el.name
LIMIT 15`,
    },
    {
      name: 'Recent SEC filings',
      query: `MATCH (e:Entity)-[:ENTITY_HAS_REPORT]->(r:Report)
RETURN e.ticker, e.name, r.form, r.report_date, r.filing_date
ORDER BY r.filing_date DESC
LIMIT 25`,
    },
    {
      name: 'Revenue by segment (dimensional)',
      query: `MATCH (f:Fact {has_dimensions: true})-[:FACT_HAS_ELEMENT]->(el:Element {qname: 'us-gaap:Revenues'}),
      (f)-[:FACT_HAS_ENTITY]->(e:Entity),
      (f)-[:FACT_HAS_DIMENSION]->(d:Dimension),
      (f)-[:FACT_HAS_PERIOD]->(p:Period)
WHERE e.ticker = 'NVDA' AND p.duration_type = 'annual'
RETURN DISTINCT d.member_uri, f.numeric_value, p.end_date
ORDER BY p.end_date DESC
LIMIT 20`,
    },
  ],
  examplesLabel: 'Example Cypher Queries:',
  noSelectionError: 'No graph selected. Please select a graph first.',
}

export default function ConsolePageContent() {
  return <ConsoleContent config={ROBOINVESTOR_CONSOLE_CONFIG} />
}
