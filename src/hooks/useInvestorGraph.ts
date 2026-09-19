import { GraphFilters, useGraphContext } from '@robosystems/core'
import { useMemo } from 'react'

/**
 * The RoboInvestor graph a page is about: the selected graph when it is a
 * RoboInvestor graph, otherwise the first RoboInvestor graph the user has.
 *
 * The selector also holds shared repositories such as SEC, so the raw
 * `currentGraphId` can name a graph with no portfolios or reports in it. Every
 * page that reads fund data resolves its graph through this one rule, so a
 * list and the detail page it links to always query the same graph.
 */
export function useInvestorGraph() {
  const { state } = useGraphContext()
  return useMemo(() => {
    const investorGraphs = state.graphs.filter(GraphFilters.roboinvestor)
    return (
      investorGraphs.find((g) => g.graphId === state.currentGraphId) ??
      investorGraphs[0]
    )
  }, [state.graphs, state.currentGraphId])
}
