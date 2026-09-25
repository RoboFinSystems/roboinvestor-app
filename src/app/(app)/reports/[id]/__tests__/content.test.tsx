import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReceivedReportContent from '../content'

// The real `GraphFilters.roboinvestor` runs, so the selector can hold the SEC
// repository the way it does in the app. The Reports list resolves its graph
// through the same hook, so this page must read the graph that list linked
// from — never the repository the selector happens to be on.
const graphState = vi.hoisted(() => ({
  graphs: [] as Array<Record<string, unknown>>,
  currentGraphId: null as string | null,
  isLoading: false,
}))

const listReports = vi.hoisted(() => vi.fn())
const getReportDownloadUrl = vi.hoisted(() => vi.fn())
const getValidToken = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    useGraphContext: () => ({ state: graphState }),
    clients: { ledger: { listReports, getReportDownloadUrl } },
    getValidToken,
    ReportChat: vi.fn(({ graphId }) => (
      <div data-testid="report-chat">{graphId}</div>
    )),
  }
})

const fundGraph = {
  graphId: 'kg-fund',
  graphName: 'Fund',
  graphType: 'entity',
  isRepository: false,
  isSubgraph: false,
  schemaExtensions: ['roboinvestor'],
}

const secRepository = {
  graphId: 'sec',
  graphName: 'SEC',
  graphType: 'entity',
  isRepository: true,
  isSubgraph: false,
  schemaExtensions: [],
}

const sharedReport = {
  id: 'rpt-1',
  name: 'Q2 Financials',
  entityName: 'Acme Widgets',
  sourceGraphId: 'kg-issuer',
  periodStart: '2026-04-01',
  periodEnd: '2026-06-30',
  sharedAt: '2026-07-15T00:00:00Z',
  createdAt: '2026-07-15T00:00:00Z',
}

describe('ReceivedReportContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    graphState.graphs = [secRepository, fundGraph]
    graphState.currentGraphId = 'sec'
    graphState.isLoading = false
    listReports.mockResolvedValue([sharedReport])
    // No bundle keeps the page from reaching the holon fetch; the graph it
    // asked is what these tests are about.
    getReportDownloadUrl.mockResolvedValue(null)
    getValidToken.mockResolvedValue('session-token')
  })

  it('reads the RoboInvestor graph when a repository is selected', async () => {
    render(<ReceivedReportContent reportId="rpt-1" />)

    await waitFor(() =>
      expect(getReportDownloadUrl).toHaveBeenCalledWith('kg-fund', 'rpt-1', {
        format: 'HOLON_JSONLD',
      })
    )
    expect(listReports).toHaveBeenCalledWith('kg-fund')
    expect(listReports).not.toHaveBeenCalledWith('sec')
    expect(
      screen.queryByText('This report is no longer available.')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('report-chat')).toHaveTextContent('kg-fund')
  })

  it('reads the selected graph when it is a RoboInvestor graph', async () => {
    const otherFund = { ...fundGraph, graphId: 'kg-fund-2' }
    graphState.graphs = [secRepository, fundGraph, otherFund]
    graphState.currentGraphId = 'kg-fund-2'

    render(<ReceivedReportContent reportId="rpt-1" />)

    await waitFor(() => expect(listReports).toHaveBeenCalledWith('kg-fund-2'))
    expect(listReports).not.toHaveBeenCalledWith('kg-fund')
  })

  it('says the report is unavailable when there is no RoboInvestor graph', async () => {
    graphState.graphs = [secRepository]

    render(<ReceivedReportContent reportId="rpt-1" />)

    expect(
      await screen.findByText('This report is no longer available.')
    ).toBeInTheDocument()
    expect(listReports).not.toHaveBeenCalled()
  })

  it('waits for the graphs to load before deciding', () => {
    graphState.graphs = []
    graphState.isLoading = true

    render(<ReceivedReportContent reportId="rpt-1" />)

    expect(
      screen.queryByText('This report is no longer available.')
    ).not.toBeInTheDocument()
    expect(listReports).not.toHaveBeenCalled()
  })

  it('sends the session token to the holon proxy', async () => {
    graphState.currentGraphId = 'kg-fund'
    getReportDownloadUrl.mockResolvedValue({
      downloadUrl:
        'https://bucket.s3.amazonaws.com/report-bundles/x.holon.jsonld',
    })
    const fetchMock = vi.fn(async () =>
      Response.json({ error: 'nope' }, { status: 502 })
    )
    vi.stubGlobal('fetch', fetchMock)
    try {
      render(<ReceivedReportContent reportId="rpt-1" />)
      await screen.findByText('Could not load this report: nope')
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/reports/holon',
        expect.objectContaining({
          headers: {
            'content-type': 'application/json',
            authorization: 'Bearer session-token',
          },
        })
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
