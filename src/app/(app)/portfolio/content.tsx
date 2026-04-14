'use client'

import {
  customTheme,
  extensions,
  GraphFilters,
  useGraphContext,
} from '@/lib/core'
import {
  Alert,
  Badge,
  Button,
  Card,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'flowbite-react'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  HiCurrencyDollar,
  HiExclamationCircle,
  HiOfficeBuilding,
  HiPencil,
  HiPlus,
  HiViewGrid,
} from 'react-icons/hi'

interface Portfolio {
  id: string
  name: string
  description: string | null
  strategy: string | null
  inception_date: string | null
  base_currency: string
  created_at: string
  updated_at: string
}

interface HoldingSecuritySummary {
  security_id: string
  security_name: string
  security_type: string
  quantity: number
  quantity_type: string
  cost_basis_dollars: number
  current_value_dollars: number | null
}

interface Holding {
  entity_id: string
  entity_name: string
  source_graph_id: string | null
  securities: HoldingSecuritySummary[]
  total_cost_basis_dollars: number
  total_current_value_dollars: number | null
  position_count: number
}

// Map the camelCase shapes returned by `extensions.investor.*` / GraphQL
// into the snake_case local view models the JSX below already consumes.
// Keeping the mapping localized here avoids rewriting the render tree.

type RawPortfolio = {
  id: string
  name: string
  description: string | null
  strategy: string | null
  inceptionDate: string | null
  baseCurrency: string
  createdAt: string
  updatedAt: string
}

type RawHoldingSecurity = {
  securityId: string
  securityName: string
  securityType: string
  quantity: number
  quantityType: string
  costBasisDollars: number
  currentValueDollars: number | null
}

type RawHolding = {
  entityId: string
  entityName: string
  sourceGraphId: string | null
  securities: RawHoldingSecurity[]
  totalCostBasisDollars: number
  totalCurrentValueDollars: number | null
  positionCount: number
}

function toPortfolio(p: RawPortfolio | Record<string, unknown>): Portfolio {
  const r = p as RawPortfolio
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    strategy: r.strategy ?? null,
    inception_date: r.inceptionDate ?? null,
    base_currency: r.baseCurrency,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  }
}

function toHolding(h: RawHolding): Holding {
  return {
    entity_id: h.entityId,
    entity_name: h.entityName,
    source_graph_id: h.sourceGraphId ?? null,
    securities: (h.securities ?? []).map((s) => ({
      security_id: s.securityId,
      security_name: s.securityName,
      security_type: s.securityType,
      quantity: s.quantity,
      quantity_type: s.quantityType,
      cost_basis_dollars: s.costBasisDollars,
      current_value_dollars: s.currentValueDollars ?? null,
    })),
    total_cost_basis_dollars: h.totalCostBasisDollars,
    total_current_value_dollars: h.totalCurrentValueDollars ?? null,
    position_count: h.positionCount,
  }
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

const securityTypeLabel: Record<string, string> = {
  common_stock: 'Common',
  preferred_stock: 'Preferred',
  warrant: 'Warrant',
  convertible_note: 'Conv. Note',
  llc_units: 'LLC Units',
  lp_interest: 'LP Interest',
  safe: 'SAFE',
  kiss: 'KISS',
  option: 'Option',
  other: 'Other',
}

const PortfolioPageContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  )
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [holdingsLoading, setHoldingsLoading] = useState(false)
  const [holdingsError, setHoldingsError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    strategy: '',
  })
  const [creating, setCreating] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [securityForm, setSecurityForm] = useState({
    name: '',
    security_type: 'common_stock',
    security_subtype: '',
    source_graph_id: '',
    entity_id: '',
    quantity: '',
    quantity_type: 'shares',
    cost_basis: '',
  })
  const [creatingSecurity, setCreatingSecurity] = useState(false)
  const [securityModalError, setSecurityModalError] = useState<string | null>(
    null
  )
  const [linkedEntities, setLinkedEntities] = useState<
    Array<{ id: string; name: string; source_graph_id: string | null }>
  >([])
  const [loadingEntities, setLoadingEntities] = useState(false)

  // Edit security modal
  const [showEditSecurityModal, setShowEditSecurityModal] = useState(false)
  const [editSecurityId, setEditSecurityId] = useState<string | null>(null)
  const [editSecurityName, setEditSecurityName] = useState('')
  const [editEntityId, setEditEntityId] = useState('')
  const [editSourceGraphId, setEditSourceGraphId] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Get the first roboinvestor graph
  const investorGraph = graphState.graphs.find(GraphFilters.roboinvestor)
  const graphId = investorGraph?.graphId

  const loadLinkedEntities = useCallback(async () => {
    if (!graphId) return
    try {
      setLoadingEntities(true)
      const entitiesList = await extensions.ledger.listEntities(graphId, {
        source: 'linked',
      })
      setLinkedEntities(
        entitiesList.map((e) => ({
          id: e.id,
          name: e.name,
          source_graph_id: e.sourceGraphId ?? null,
        }))
      )
    } catch {
      // Silently fail — linked entities are optional
      setLinkedEntities([])
    } finally {
      setLoadingEntities(false)
    }
  }, [graphId])

  const loadPortfolios = useCallback(async () => {
    if (!graphId) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const data = await extensions.investor.listPortfolios(graphId)
      const list = (data?.portfolios ?? []).map(toPortfolio)
      setPortfolios(list)
      if (list.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(list[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolios')
    } finally {
      setIsLoading(false)
    }
  }, [graphId, selectedPortfolio])

  const loadHoldings = useCallback(
    async (portfolioId: string) => {
      if (!graphId) return
      try {
        setHoldingsLoading(true)
        setHoldingsError(null)
        const data = await extensions.investor.getHoldings(graphId, portfolioId)
        setHoldings(((data?.holdings as RawHolding[]) ?? []).map(toHolding))
      } catch (err) {
        setHoldings([])
        setHoldingsError(
          err instanceof Error ? err.message : 'Failed to load holdings'
        )
      } finally {
        setHoldingsLoading(false)
      }
    },
    [graphId]
  )

  const openEditSecurity = useCallback(
    (securityId: string, securityName: string) => {
      setEditSecurityId(securityId)
      setEditSecurityName(securityName)
      setEditEntityId('')
      setEditSourceGraphId('')
      setEditError(null)
      loadLinkedEntities()
      setShowEditSecurityModal(true)
    },
    [loadLinkedEntities]
  )

  const handleEditSecurity = useCallback(async () => {
    if (!graphId || !editSecurityId) return
    try {
      setSavingEdit(true)
      setEditError(null)
      const updates: Record<string, string | null> = {}
      if (editEntityId) updates.entity_id = editEntityId
      if (editSourceGraphId.trim())
        updates.source_graph_id = editSourceGraphId.trim()

      await extensions.investor.updateSecurity(graphId, editSecurityId, updates)

      setShowEditSecurityModal(false)
      if (selectedPortfolio) loadHoldings(selectedPortfolio.id)
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : 'Failed to update security'
      )
    } finally {
      setSavingEdit(false)
    }
  }, [
    graphId,
    editSecurityId,
    editEntityId,
    editSourceGraphId,
    selectedPortfolio,
    loadHoldings,
  ])

  useEffect(() => {
    loadPortfolios()
  }, [loadPortfolios])

  useEffect(() => {
    if (selectedPortfolio) {
      loadHoldings(selectedPortfolio.id)
    } else {
      setHoldings([])
    }
  }, [selectedPortfolio, loadHoldings])

  const handleCreate = async () => {
    if (!graphId || !createForm.name.trim()) return
    try {
      setCreating(true)
      const raw = await extensions.investor.createPortfolio(graphId, {
        name: createForm.name.trim(),
        description: createForm.description.trim() || null,
        strategy: createForm.strategy.trim() || null,
      })
      const portfolio = toPortfolio(raw)
      setPortfolios((prev) => [...prev, portfolio])
      setShowCreateModal(false)
      setCreateForm({ name: '', description: '', strategy: '' })
      setSelectedPortfolio(portfolio)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create portfolio'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleCreateSecurity = async () => {
    if (!graphId || !selectedPortfolio || !securityForm.name.trim()) return
    try {
      setCreatingSecurity(true)
      setSecurityModalError(null)

      // 1. Create the security
      const security = await extensions.investor.createSecurity(graphId, {
        name: securityForm.name.trim(),
        security_type: securityForm.security_type,
        security_subtype: securityForm.security_subtype.trim() || null,
        entity_id: securityForm.entity_id || null,
        source_graph_id: securityForm.source_graph_id.trim() || null,
      })

      // 2. Create the position if quantity was provided
      if (securityForm.quantity) {
        const costBasisCents = securityForm.cost_basis
          ? Math.round(parseFloat(securityForm.cost_basis) * 100)
          : 0

        await extensions.investor.createPosition(graphId, {
          portfolio_id: selectedPortfolio.id,
          security_id: (security as { id: string }).id,
          quantity: parseFloat(securityForm.quantity),
          quantity_type: securityForm.quantity_type,
          cost_basis: costBasisCents,
        })
      }

      setShowSecurityModal(false)
      setSecurityModalError(null)
      setSecurityForm({
        name: '',
        security_type: 'common_stock',
        security_subtype: '',
        source_graph_id: '',
        entity_id: '',
        quantity: '',
        quantity_type: 'shares',
        cost_basis: '',
      })
      // Reload holdings
      loadHoldings(selectedPortfolio.id)
    } catch (err) {
      setSecurityModalError(
        err instanceof Error ? err.message : 'Failed to create security'
      )
    } finally {
      setCreatingSecurity(false)
    }
  }

  // No graph with roboinvestor extension
  if (!graphId && !isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <Card theme={customTheme.card} className="text-center">
          <div className="py-8">
            <HiViewGrid className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              No Portfolio Graph
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Create a graph with the <code>roboinvestor</code> schema extension
              to get started with portfolio management.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 p-3">
            <HiViewGrid className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your investment portfolios and holdings
            </p>
          </div>
        </div>
        <Button
          color="teal"
          onClick={() => setShowCreateModal(true)}
          disabled={isLoading}
        >
          <HiPlus className="mr-2 h-4 w-4" />
          New Portfolio
        </Button>
      </div>

      {error && (
        <Alert
          theme={customTheme.alert}
          color="failure"
          icon={HiExclamationCircle}
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="xl" />
        </div>
      ) : portfolios.length === 0 ? (
        <Card theme={customTheme.card} className="text-center">
          <div className="py-8">
            <HiViewGrid className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              No Portfolios Yet
            </h2>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Create your first portfolio to start tracking investments.
            </p>
            <Button color="teal" onClick={() => setShowCreateModal(true)}>
              <HiPlus className="mr-2 h-4 w-4" />
              Create Portfolio
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Portfolio list sidebar */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Portfolios
            </h2>
            {portfolios.map((p) => (
              <Card
                key={p.id}
                theme={customTheme.card}
                className={`cursor-pointer transition-all ${
                  selectedPortfolio?.id === p.id
                    ? 'ring-2 ring-teal-500'
                    : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                }`}
                onClick={() => setSelectedPortfolio(p)}
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {p.name}
                  </h3>
                  {p.strategy && (
                    <Badge color="gray" className="mt-1">
                      {p.strategy}
                    </Badge>
                  )}
                  {p.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {p.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Holdings detail */}
          <div className="lg:col-span-2">
            {selectedPortfolio ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedPortfolio.name}
                  </h2>
                  <Button
                    size="sm"
                    color="teal"
                    onClick={() => {
                      setSecurityModalError(null)
                      loadLinkedEntities()
                      setShowSecurityModal(true)
                    }}
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Security
                  </Button>
                </div>

                {holdingsError && (
                  <Alert
                    theme={customTheme.alert}
                    color="failure"
                    icon={HiExclamationCircle}
                  >
                    {holdingsError}
                  </Alert>
                )}

                {holdingsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : holdings.length === 0 ? (
                  <Card theme={customTheme.card} className="text-center">
                    <div className="py-6">
                      <HiOfficeBuilding className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No holdings yet. Add entities, securities, and positions
                        via the API to see them here.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {holdings.map((h) => (
                      <Card key={h.entity_id} theme={customTheme.card}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <HiOfficeBuilding className="h-5 w-5 text-teal-500" />
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {h.entity_name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Cost:{' '}
                                {formatCurrency(h.total_cost_basis_dollars)}
                              </span>
                              {h.total_current_value_dollars != null && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Value:{' '}
                                  {formatCurrency(
                                    h.total_current_value_dollars
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {h.source_graph_id && (
                            <Badge color="info" className="text-xs">
                              Linked graph: {h.source_graph_id}
                            </Badge>
                          )}

                          <Table theme={customTheme.table}>
                            <TableHead>
                              <TableHeadCell>Security</TableHeadCell>
                              <TableHeadCell>Type</TableHeadCell>
                              <TableHeadCell>Quantity</TableHeadCell>
                              <TableHeadCell>Cost Basis</TableHeadCell>
                              <TableHeadCell>Current Value</TableHeadCell>
                              <TableHeadCell className="w-12"></TableHeadCell>
                            </TableHead>
                            <TableBody className="divide-y">
                              {h.securities.map((s) => (
                                <TableRow key={s.security_id}>
                                  <TableCell className="font-medium text-gray-900 dark:text-white">
                                    {s.security_name}
                                  </TableCell>
                                  <TableCell>
                                    <Badge color="gray">
                                      {securityTypeLabel[s.security_type] ||
                                        s.security_type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {s.quantity.toLocaleString()}{' '}
                                    {s.quantity_type}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(s.cost_basis_dollars)}
                                  </TableCell>
                                  <TableCell>
                                    {s.current_value_dollars != null ? (
                                      <span className="flex items-center gap-1">
                                        <HiCurrencyDollar className="h-4 w-4 text-green-500" />
                                        {formatCurrency(
                                          s.current_value_dollars
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">--</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      onClick={() =>
                                        openEditSecurity(
                                          s.security_id,
                                          s.security_name
                                        )
                                      }
                                      className="rounded p-1 text-gray-400 hover:text-teal-500"
                                    >
                                      <HiPencil className="h-4 w-4" />
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card theme={customTheme.card} className="text-center">
                <div className="py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a portfolio to view holdings
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Create Portfolio Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="md"
      >
        <ModalHeader>Create Portfolio</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput
                id="name"
                placeholder="My PE Portfolio"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy (optional)</Label>
              <TextInput
                id="strategy"
                placeholder="e.g., pe_fund, venture, growth"
                value={createForm.strategy}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, strategy: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <TextInput
                id="description"
                placeholder="Portfolio description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="teal"
            onClick={handleCreate}
            disabled={creating || !createForm.name.trim()}
          >
            {creating ? <Spinner size="sm" className="mr-2" /> : null}
            Create
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Security Modal */}
      <Modal
        show={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        size="md"
      >
        <ModalHeader>Add Security</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {securityModalError && (
              <Alert
                theme={customTheme.alert}
                color="failure"
                icon={HiExclamationCircle}
              >
                {securityModalError}
              </Alert>
            )}
            <div>
              <Label htmlFor="sec-name">Security Name</Label>
              <TextInput
                id="sec-name"
                placeholder="e.g., Common Stock Class A"
                value={securityForm.name}
                onChange={(e) =>
                  setSecurityForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="sec-type">Security Type</Label>
              <select
                id="sec-type"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={securityForm.security_type}
                onChange={(e) =>
                  setSecurityForm((f) => ({
                    ...f,
                    security_type: e.target.value,
                  }))
                }
              >
                {Object.entries(securityTypeLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sec-subtype">Subtype (optional)</Label>
              <TextInput
                id="sec-subtype"
                placeholder="e.g., class_a, series_a"
                value={securityForm.security_subtype}
                onChange={(e) =>
                  setSecurityForm((f) => ({
                    ...f,
                    security_subtype: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="sec-entity">Company (optional)</Label>
              {loadingEntities ? (
                <div className="flex items-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-400">
                    Loading companies...
                  </span>
                </div>
              ) : linkedEntities.length > 0 ? (
                <select
                  id="sec-entity"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={securityForm.entity_id}
                  onChange={(e) => {
                    const entityId = e.target.value
                    const entity = linkedEntities.find(
                      (ent) => ent.id === entityId
                    )
                    setSecurityForm((f) => ({
                      ...f,
                      entity_id: entityId,
                      source_graph_id:
                        entity?.source_graph_id || f.source_graph_id,
                    }))
                  }}
                >
                  <option value="">No company linked</option>
                  {linkedEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="py-2 text-sm text-gray-400">
                  No companies have shared reports with you yet.
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Companies appear here after they share a report with your graph
              </p>
            </div>
            <div>
              <Label htmlFor="sec-graph">Source Graph ID (optional)</Label>
              <TextInput
                id="sec-graph"
                placeholder="e.g., kg19d46a8029980520"
                value={securityForm.source_graph_id}
                onChange={(e) =>
                  setSecurityForm((f) => ({
                    ...f,
                    source_graph_id: e.target.value,
                  }))
                }
              />
              <p className="mt-1 text-xs text-gray-400">
                Pre-associate to a company graph before a report is shared
              </p>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Position (optional)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sec-qty">Quantity</Label>
                <TextInput
                  id="sec-qty"
                  type="number"
                  placeholder="10000"
                  value={securityForm.quantity}
                  onChange={(e) =>
                    setSecurityForm((f) => ({
                      ...f,
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="sec-qty-type">Unit</Label>
                <select
                  id="sec-qty-type"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={securityForm.quantity_type}
                  onChange={(e) =>
                    setSecurityForm((f) => ({
                      ...f,
                      quantity_type: e.target.value,
                    }))
                  }
                >
                  <option value="shares">Shares</option>
                  <option value="units">Units</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="sec-cost">Cost Basis ($)</Label>
              <TextInput
                id="sec-cost"
                type="number"
                placeholder="150000"
                value={securityForm.cost_basis}
                onChange={(e) =>
                  setSecurityForm((f) => ({
                    ...f,
                    cost_basis: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="teal"
            onClick={handleCreateSecurity}
            disabled={creatingSecurity || !securityForm.name.trim()}
          >
            {creatingSecurity ? <Spinner size="sm" className="mr-2" /> : null}
            Add
          </Button>
          <Button color="gray" onClick={() => setShowSecurityModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* Edit Security Modal */}
      <Modal
        show={showEditSecurityModal}
        onClose={() => setShowEditSecurityModal(false)}
        size="md"
      >
        <ModalHeader>Link Security — {editSecurityName}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {editError && (
              <Alert
                theme={customTheme.alert}
                color="failure"
                icon={HiExclamationCircle}
              >
                {editError}
              </Alert>
            )}
            <div>
              <Label htmlFor="edit-entity">Company</Label>
              {loadingEntities ? (
                <div className="flex items-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-400">Loading...</span>
                </div>
              ) : linkedEntities.length > 0 ? (
                <select
                  id="edit-entity"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={editEntityId}
                  onChange={(e) => {
                    const entityId = e.target.value
                    const entity = linkedEntities.find(
                      (ent) => ent.id === entityId
                    )
                    setEditEntityId(entityId)
                    if (entity?.source_graph_id) {
                      setEditSourceGraphId(entity.source_graph_id)
                    }
                  }}
                >
                  <option value="">No company linked</option>
                  {linkedEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="py-2 text-sm text-gray-400">
                  No companies have shared reports with you yet.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-graph">Source Graph ID</Label>
              <TextInput
                id="edit-graph"
                placeholder="e.g., kg19d46a8029980520"
                value={editSourceGraphId}
                onChange={(e) => setEditSourceGraphId(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="teal"
            onClick={handleEditSecurity}
            disabled={
              savingEdit || (!editEntityId && !editSourceGraphId.trim())
            }
          >
            {savingEdit ? <Spinner size="sm" className="mr-2" /> : null}
            Save
          </Button>
          <Button color="gray" onClick={() => setShowEditSecurityModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default PortfolioPageContent
