'use client'

import { ConsoleContent, type ConsoleConfig } from '@/lib/core'

const ROBOINVESTOR_CONSOLE_CONFIG: ConsoleConfig = {
  header: {
    title: 'RoboInvestor Console',
    subtitle: 'Interactive investment analysis',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
  },
  welcome: {
    consoleName: 'RoboInvestor Console',
    description: 'Claude-powered interactive investment analysis console',
    contextLabel: 'Portfolio',
    naturalLanguageExamples: [
      'Show me my portfolio performance',
      'What are my top performing holdings?',
      'Analyze my asset allocation',
      'What dividends have I received this year?',
    ],
    directQueryExamples: [
      'MATCH (h:Holding) RETURN h.symbol, h.shares LIMIT 10',
      'MATCH (t:Transaction) RETURN t.date, t.type ORDER BY t.date DESC',
    ],
    closingMessage: 'How can I help you analyze your investments today?',
  },
  mcp: {
    serverName: 'roboinvestor',
    packageName: '@roboinvestor/mcp',
    exampleQuestions: [
      'Show me my portfolio performance this year',
      'What are my best performing holdings?',
      'Analyze my dividend income trends',
    ],
    contextIdFallback: 'your_portfolio_id',
  },
  sampleQueries: [
    {
      name: 'Portfolio holdings',
      query: `MATCH (h:Holding)-[:IN_PORTFOLIO]->(p:Portfolio)
RETURN h.symbol, h.shares, h.cost_basis, h.current_value
ORDER BY h.current_value DESC LIMIT 20`,
    },
    {
      name: 'Recent transactions',
      query: `MATCH (t:Transaction)-[:IN_ACCOUNT]->(a:Account)
RETURN t.date, t.type, t.symbol, t.shares, t.price
ORDER BY t.date DESC LIMIT 20`,
    },
    {
      name: 'Asset allocation',
      query: `MATCH (h:Holding)-[:HAS_ASSET_CLASS]->(ac:AssetClass)
RETURN ac.name, sum(h.current_value) as total_value
ORDER BY total_value DESC`,
    },
    {
      name: 'Performance metrics',
      query: `MATCH (p:Portfolio)
RETURN p.name, p.total_value, p.total_gain_loss, p.return_percentage
ORDER BY p.return_percentage DESC`,
    },
    {
      name: 'Dividend income',
      query: `MATCH (d:Dividend)-[:FROM_HOLDING]->(h:Holding)
RETURN h.symbol, d.date, d.amount, d.type
ORDER BY d.date DESC LIMIT 20`,
    },
    {
      name: 'Risk analysis',
      query: `MATCH (h:Holding)
WHERE h.beta IS NOT NULL
RETURN h.symbol, h.beta, h.volatility, h.sharpe_ratio
ORDER BY h.beta DESC LIMIT 20`,
    },
  ],
  examplesLabel: 'Example Investment Queries:',
  noSelectionError: 'No portfolio selected. Please select a portfolio first.',
}

export default function ConsolePageContent() {
  return <ConsoleContent config={ROBOINVESTOR_CONSOLE_CONFIG} />
}
