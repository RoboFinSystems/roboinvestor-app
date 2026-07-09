'use client'

import {
  ConsoleContent,
  useGraphAwareConsoleConfig,
  type ConsoleBranding,
} from '@/lib/core'

// The example sets themselves live in core (graphAwareConfig) so all three
// apps stay in sync; this app only supplies branding. When the user is on a
// RoboInvestor entity graph the console shows portfolio examples, on the SEC
// repository it shows filing-analysis examples, and on a generic graph it
// shows structure-discovery examples.
const ROBOINVESTOR_BRANDING: ConsoleBranding = {
  title: 'RoboInvestor Console',
  consoleName: 'RoboInvestor Console',
  gradientFrom: 'from-emerald-500',
  gradientTo: 'to-teal-600',
  closingMessage: 'What would you like to analyze today?',
  mcp: {
    serverName: 'robosystems',
    packageName: '@robosystems/mcp',
    contextIdFallback: 'your_graph_id',
  },
  // A graph carrying both entity extensions reads as a portfolio graph here.
  preferredKind: 'roboinvestor',
}

export default function ConsolePageContent() {
  const config = useGraphAwareConsoleConfig(ROBOINVESTOR_BRANDING)
  return <ConsoleContent config={config} />
}
