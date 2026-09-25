import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ReceivedReportContent from '../content'

// A graph switch keeps the user on /reports/<id> (the selector switches graphs
// without navigating), so the viewer must drop whatever the previous graph
// loaded, and a slow load from that graph must not land afterwards.
const graphState = vi.hoisted(() => ({
  graphs: [] as Array<Record<string, unknown>>,
  currentGraphId: null as string | null,
  isLoading: false,
}))
const listReports = vi.hoisted(() => vi.fn())
const getReportDownloadUrl = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    useGraphContext: () => ({ state: graphState }),
    clients: { ledger: { listReports, getReportDownloadUrl } },
    getValidToken: vi.fn(async () => 'tok'),
    ReportChat: ({
      graphId,
      anchorNote,
    }: {
      graphId: string
      anchorNote: string
    }) => <div data-testid="report-chat">{`${graphId}|${anchorNote}`}</div>,
  }
})

vi.mock('@robosystems/report-components/adapters', () => ({
  parseJsonld: vi.fn(async (text: string) => ({
    informationBlocks: [{ id: 'ib' }],
    marker: text,
  })),
}))

vi.mock('@robosystems/report-components', () => ({
  reportSections: () => [],
  sliceReportSection: (r: unknown) => r,
  ReportView: ({ report }: { report: { marker: string } }) => (
    <div data-testid="report-view">{report.marker}</div>
  ),
}))

const fund = (graphId: string) => ({
  graphId,
  graphName: graphId,
  graphType: 'entity',
  isRepository: false,
  isSubgraph: false,
  schemaExtensions: ['roboinvestor'],
})

const report = (name: string) => ({
  id: 'rpt-1',
  name,
  entityName: 'Acme',
  sourceGraphId: 'kg-issuer',
  periodStart: '2026-04-01',
  periodEnd: '2026-06-30',
  sharedAt: null,
  createdAt: '2026-07-01',
})

describe('report viewer across a graph switch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    graphState.graphs = [fund('kg-a'), fund('kg-b')]
    graphState.currentGraphId = 'kg-a'
    getReportDownloadUrl.mockImplementation(async (g: string) => ({
      downloadUrl: `https://bucket.s3.amazonaws.com/report-bundles/${g}/r/g1.holon.jsonld`,
    }))
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: { body: string }) => {
        const { url } = JSON.parse(init.body) as { url: string }
        return new Response(url.includes('/kg-a/') ? 'REPORT-A' : 'REPORT-B')
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('drops graph A’s report when graph B does not hold it', async () => {
    listReports.mockImplementation(async (g: string) =>
      g === 'kg-a' ? [report('Q2 A')] : []
    )
    const { rerender } = render(<ReceivedReportContent reportId="rpt-1" />)
    expect(await screen.findByTestId('report-view')).toHaveTextContent(
      'REPORT-A'
    )

    graphState.currentGraphId = 'kg-b'
    rerender(<ReceivedReportContent reportId="rpt-1" />)

    await screen.findByText('This report is no longer available.')
    expect(screen.queryByTestId('report-view')).toBeNull()
    // The chat must not stay anchored on graph A's report under graph B.
    expect(screen.queryByTestId('report-chat')).toBeNull()
  })

  it('lets the current graph win over a slower load from the previous one', async () => {
    let releaseA: () => void = () => {}
    listReports.mockImplementation((g: string) =>
      g === 'kg-a'
        ? new Promise((resolve) => {
            releaseA = () => resolve([report('Q2 A')])
          })
        : Promise.resolve([report('Q2 B')])
    )
    const { rerender } = render(<ReceivedReportContent reportId="rpt-1" />)
    await waitFor(() => expect(listReports).toHaveBeenCalledWith('kg-a'))

    graphState.currentGraphId = 'kg-b'
    rerender(<ReceivedReportContent reportId="rpt-1" />)
    expect(await screen.findByTestId('report-view')).toHaveTextContent(
      'REPORT-B'
    )

    releaseA()
    await new Promise((r) => setTimeout(r, 20))
    expect(screen.getByTestId('report-view')).toHaveTextContent('REPORT-B')
    expect(screen.getByTestId('report-chat')).toHaveTextContent('kg-b|')
    expect(getReportDownloadUrl).not.toHaveBeenCalledWith(
      'kg-a',
      expect.anything(),
      expect.anything()
    )
  })
})
