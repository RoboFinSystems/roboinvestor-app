'use client'

import DocsLink from '@/components/DocsLink'
import { useInvestorGraph } from '@/hooks/useInvestorGraph'
import {
  clients,
  EmptyState,
  LoadingState,
  PageHeader,
  PageLayout,
} from '@robosystems/core'
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
  Select,
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
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  HiCurrencyDollar,
  HiExclamationCircle,
  HiOfficeBuilding,
  HiPencil,
  HiPlus,
  HiViewGrid,
} from 'react-icons/hi'
import { parseMoneyToCents, parseQuantity } from './money'

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

// Map the camelCase shapes returned by `clients.investor.*` / GraphQL
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

/** Amounts in the portfolio's own base currency; USD when none is set. */
const formatCurrency = (
  amount: number,
  currency: string | null | undefined
) => {
  const code = currency?.trim().toUpperCase() || 'USD'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // An unrecognised code still shows the number and says which unit it is.
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)} ${code}`
  }
}

/**
 * The security types offered when adding a security: the API's documented
 * vocabulary (`CreateSecurityRequest.security_type`), so rows written here and
 * through MCP or the SDK carry the same strings.
 */
const securityTypeOptions: Array<[string, string]> = [
  ['common_stock', 'Common'],
  ['preferred_stock', 'Preferred'],
  ['warrant', 'Warrant'],
  ['convertible_note', 'Conv. Note'],
  ['safe', 'SAFE'],
  ['option', 'Option'],
  ['restricted_stock_unit', 'RSU'],
  ['llc_unit', 'LLC Units'],
  ['lp_interest', 'LP Interest'],
  ['other', 'Other'],
]

/** Display labels, including values earlier versions of this form wrote. */
const securityTypeLabel: Record<string, string> = {
  ...Object.fromEntries(securityTypeOptions),
  llc_units: 'LLC Units',
  kiss: 'KISS',
}

const emptySecurityForm = {
  name: '',
  security_type: 'common_stock',
  security_subtype: '',
  source_graph_id: '',
  entity_id: '',
  quantity: '',
  quantity_type: 'shares',
  cost_basis: '',
}

/** The fields that define the security itself, as opposed to its position. */
const securityFields = (f: typeof emptySecurityForm) => ({
  name: f.name.trim(),
  security_type: f.security_type,
  security_subtype: f.security_subtype.trim(),
  entity_id: f.entity_id,
  source_graph_id: f.source_graph_id.trim(),
})
type SecurityFields = ReturnType<typeof securityFields>

const PortfolioPageContent: FC = function () {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  )
  // The graph the selection was made in. State updates from a graph switch
  // land a render after the effects that read them, so without this tag the
  // holdings effect fires once with the new graph and the old portfolio id.
  const [selectionGraphId, setSelectionGraphId] = useState<string | undefined>(
    undefined
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
  const [createModalError, setCreateModalError] = useState<string | null>(null)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [securityForm, setSecurityForm] = useState(emptySecurityForm)
  // The security this modal session already created, and the fields it was
  // created from. "Add Security" is two writes; when the position write fails
  // the retry must reuse this security rather than mint a second one.
  // It survives closing the modal (the form keeps its values too), and is
  // cleared on success and on a graph switch.
  const [pendingSecurity, setPendingSecurity] = useState<{
    id: string
    fields: SecurityFields
  } | null>(null)
  const [creatingSecurity, setCreatingSecurity] = useState(false)
  const [securityModalError, setSecurityModalError] = useState<string | null>(
    null
  )
  const [linkedEntities, setLinkedEntities] = useState<
    Array<{ id: string; name: string; source_graph_id: string | null }>
  >([])
  const [loadingEntities, setLoadingEntities] = useState(false)
  const [entitiesError, setEntitiesError] = useState<string | null>(null)

  // Edit security modal
  const [showEditSecurityModal, setShowEditSecurityModal] = useState(false)
  const [editSecurityId, setEditSecurityId] = useState<string | null>(null)
  const [editSecurityName, setEditSecurityName] = useState('')
  const [editEntityId, setEditEntityId] = useState('')
  const [editSourceGraphId, setEditSourceGraphId] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // The same rule as Reports and the report viewer, so every page agrees on
  // which graph a user with more than one is looking at.
  const graphId = useInvestorGraph()?.graphId

  // Every id on this page — portfolio, security, entity — belongs to one graph.
  // The loaders below are also re-invoked directly after a mutation, where an
  // effect cleanup would never fire, so they carry sequence numbers and discard
  // their result when a newer load has started. `graphIdRef` lets a write that
  // is already in flight tell whether the graph moved under it.
  const graphIdRef = useRef(graphId)
  useEffect(() => {
    graphIdRef.current = graphId
  }, [graphId])
  const portfoliosSeq = useRef(0)
  const holdingsSeq = useRef(0)
  const entitiesSeq = useRef(0)

  // The only selection anything may act on: one that belongs to the graph
  // currently in view. Everything downstream — the holdings read, the detail
  // pane and the writes it hosts — goes through this rather than
  // `selectedPortfolio`, so a selection left over from the previous graph
  // cannot pair its id with the new graph.
  const activeSelection =
    selectedPortfolio && selectionGraphId === graphId ? selectedPortfolio : null

  const loadLinkedEntities = useCallback(async () => {
    if (!graphId) return
    const seq = ++entitiesSeq.current
    try {
      setLoadingEntities(true)
      setEntitiesError(null)
      const entitiesList = await clients.ledger.listEntities(graphId, {
        source: 'linked',
      })
      if (seq !== entitiesSeq.current) return
      setLinkedEntities(
        entitiesList.map((e) => ({
          id: e.id,
          name: e.name,
          source_graph_id: e.sourceGraphId ?? null,
        }))
      )
    } catch (err) {
      if (seq !== entitiesSeq.current) return
      setLinkedEntities([])
      setEntitiesError(
        `Could not load companies: ${
          err instanceof Error ? err.message : String(err)
        }`
      )
    } finally {
      if (seq === entitiesSeq.current) setLoadingEntities(false)
    }
  }, [graphId])

  const loadPortfolios = useCallback(async () => {
    if (!graphId) {
      setIsLoading(false)
      return
    }
    const seq = ++portfoliosSeq.current
    try {
      setIsLoading(true)
      setError(null)
      const data = await clients.investor.listPortfolios(graphId)
      if (seq !== portfoliosSeq.current) return
      const list = (data?.portfolios ?? []).map(toPortfolio)
      setPortfolios(list)
      // Keep the selection if this graph still has it, otherwise fall back to
      // the head of its list. The graph-change effect above clears the
      // selection first, so on a switch this seeds; the lookup matters for any
      // later plain refresh, which must not move the user's selection.
      setSelectedPortfolio(
        (prev) =>
          list.find((p) => p.id === prev?.id) ??
          (list.length > 0 ? list[0] : null)
      )
      setSelectionGraphId(graphId)
    } catch (err) {
      if (seq !== portfoliosSeq.current) return
      setError(err instanceof Error ? err.message : 'Failed to load portfolios')
    } finally {
      if (seq === portfoliosSeq.current) setIsLoading(false)
    }
  }, [graphId])

  const loadHoldings = useCallback(
    async (portfolioId: string) => {
      if (!graphId) return
      const seq = ++holdingsSeq.current
      try {
        setHoldingsLoading(true)
        setHoldingsError(null)
        const data = await clients.investor.getHoldings(graphId, portfolioId)
        if (seq !== holdingsSeq.current) return
        setHoldings(((data?.holdings as RawHolding[]) ?? []).map(toHolding))
      } catch (err) {
        if (seq !== holdingsSeq.current) return
        setHoldings([])
        setHoldingsError(
          err instanceof Error ? err.message : 'Failed to load holdings'
        )
      } finally {
        if (seq === holdingsSeq.current) setHoldingsLoading(false)
      }
    },
    [graphId]
  )

  // What the security currently carries, so the modal opens on it and a save
  // sends only what the user changed.
  const [editLoaded, setEditLoaded] = useState({
    entityId: '',
    sourceGraphId: '',
  })
  const editSeq = useRef(0)
  // Set once the user edits a field, so a late prefill cannot overwrite it.
  const editTouched = useRef(false)

  const openEditSecurity = useCallback(
    (securityId: string, securityName: string) => {
      setEditSecurityId(securityId)
      setEditSecurityName(securityName)
      setEditEntityId('')
      setEditSourceGraphId('')
      setEditLoaded({ entityId: '', sourceGraphId: '' })
      editTouched.current = false
      setEditError(null)
      loadLinkedEntities()
      setShowEditSecurityModal(true)
      if (!graphId) return
      const requestGraphId = graphId
      const seq = ++editSeq.current
      clients.investor
        .getSecurity(requestGraphId, securityId)
        .then((security) => {
          if (seq !== editSeq.current || graphIdRef.current !== requestGraphId)
            return
          const loaded = {
            entityId: security?.entityId ?? '',
            sourceGraphId: security?.sourceGraphId ?? '',
          }
          setEditLoaded(loaded)
          if (editTouched.current) return
          setEditEntityId(loaded.entityId)
          setEditSourceGraphId(loaded.sourceGraphId)
        })
        .catch((err: unknown) => {
          if (seq !== editSeq.current || graphIdRef.current !== requestGraphId)
            return
          setEditError(
            `Could not load this security's current link: ${
              err instanceof Error ? err.message : String(err)
            }`
          )
        })
    },
    [graphId, loadLinkedEntities]
  )

  const handleEditSecurity = useCallback(async () => {
    if (!graphId || !editSecurityId) return
    const requestGraphId = graphId
    try {
      setSavingEdit(true)
      setEditError(null)
      const updates: Record<string, string | null> = {}
      // Only changed, non-empty values: clearing a link is not offered here.
      if (editEntityId && editEntityId !== editLoaded.entityId)
        updates.entity_id = editEntityId
      const sourceGraphId = editSourceGraphId.trim()
      if (sourceGraphId && sourceGraphId !== editLoaded.sourceGraphId)
        updates.source_graph_id = sourceGraphId
      if (Object.keys(updates).length === 0) {
        setShowEditSecurityModal(false)
        return
      }

      await clients.investor.updateSecurity(
        requestGraphId,
        editSecurityId,
        updates
      )

      // The write targeted the right graph, but the graph-change reset has
      // already cleared this modal and reloaded holdings if the graph moved.
      if (graphIdRef.current !== requestGraphId) return
      setShowEditSecurityModal(false)
      if (activeSelection) loadHoldings(activeSelection.id)
    } catch (err) {
      if (graphIdRef.current !== requestGraphId) return
      setEditError(
        err instanceof Error ? err.message : 'Failed to update security'
      )
    } finally {
      if (graphIdRef.current === requestGraphId) setSavingEdit(false)
    }
  }, [
    graphId,
    editSecurityId,
    editEntityId,
    editSourceGraphId,
    editLoaded,
    activeSelection,
    loadHoldings,
  ])

  useEffect(() => {
    // Drop everything scoped to the previous graph before loading. Leaving the
    // selection or an open modal in place would let a write fire against the
    // new graph carrying the old graph's portfolio, security or entity id —
    // and both modals are gated on state cleared here.
    setPortfolios([])
    setSelectedPortfolio(null)
    setSelectionGraphId(undefined)
    setHoldings([])
    setError(null)
    setHoldingsError(null)
    // Invalidate any linked-companies load still in flight for the old graph.
    entitiesSeq.current++
    setLinkedEntities([])
    setEntitiesError(null)
    setLoadingEntities(false)
    setPendingSecurity(null)
    setShowCreateModal(false)
    setCreateModalError(null)
    setShowSecurityModal(false)
    setShowEditSecurityModal(false)
    setEditSecurityId(null)
    editSeq.current++
    setEditError(null)
    setSecurityModalError(null)

    loadPortfolios()
  }, [loadPortfolios])

  useEffect(() => {
    if (activeSelection) {
      loadHoldings(activeSelection.id)
    } else {
      setHoldings([])
    }
  }, [activeSelection, loadHoldings])

  const handleCreate = async () => {
    if (!graphId || !createForm.name.trim()) return
    const requestGraphId = graphId
    try {
      setCreating(true)
      setCreateModalError(null)
      const raw = await clients.investor.createPortfolioBlock(requestGraphId, {
        portfolio: {
          name: createForm.name.trim(),
          description: createForm.description.trim() || null,
          strategy: createForm.strategy.trim() || null,
        },
      })
      // Adding the new portfolio to a list that now belongs to another graph
      // would show it under, and select it for, the wrong graph.
      if (graphIdRef.current !== requestGraphId) return
      const portfolio = toPortfolio(raw)
      setPortfolios((prev) => [...prev, portfolio])
      setShowCreateModal(false)
      setCreateForm({ name: '', description: '', strategy: '' })
      setSelectedPortfolio(portfolio)
      setSelectionGraphId(requestGraphId)
    } catch (err) {
      if (graphIdRef.current !== requestGraphId) return
      // Shown inside the dialog: a page-level alert sits behind its backdrop.
      setCreateModalError(
        err instanceof Error ? err.message : 'Failed to create portfolio'
      )
    } finally {
      if (graphIdRef.current === requestGraphId) setCreating(false)
    }
  }

  const handleCreateSecurity = async () => {
    if (!graphId || !activeSelection || !securityForm.name.trim()) return

    // Validate everything before creating anything: the security is written
    // first, so failing after it leaves an orphan behind. A position is
    // required — a security with none appears nowhere in this app.
    if (!securityForm.quantity.trim()) {
      setSecurityModalError(
        'Enter a quantity. A security with no position does not appear in holdings.'
      )
      return
    }
    const quantity = parseQuantity(securityForm.quantity)
    if (quantity === null) {
      setSecurityModalError(
        'Enter a positive quantity, e.g. 1500.5 — write fifteen hundred as 1500 or 1,500'
      )
      return
    }
    const costBasis = parseMoneyToCents(securityForm.cost_basis)
    if (costBasis === null) {
      setSecurityModalError(
        'Enter the cost basis as an amount, e.g. 1525.50 or 1,525.50'
      )
      return
    }

    const requestGraphId = graphId
    const requestPortfolioId = activeSelection.id
    try {
      setCreatingSecurity(true)
      setSecurityModalError(null)

      // 1. Create the security — unless this modal session already created
      // it and only the position write failed.
      const fields = securityFields(securityForm)
      const created = async () => {
        const security = await clients.investor.createSecurity(requestGraphId, {
          name: fields.name,
          security_type: fields.security_type,
          security_subtype: fields.security_subtype || null,
          entity_id: fields.entity_id || null,
          source_graph_id: fields.source_graph_id || null,
        })
        return (security as { id: string }).id
      }
      const finish = () => {
        setPendingSecurity(null)
        setShowSecurityModal(false)
        setSecurityModalError(null)
        setSecurityForm(emptySecurityForm)
        loadHoldings(requestPortfolioId)
      }
      let securityId: string
      if (!pendingSecurity) {
        securityId = await created()
      } else {
        // The last position write may have committed even though it reported
        // an error (a dropped connection). If the position is there, the add
        // is done: adding again would double-book it, and retiring the
        // security would orphan a held position.
        const existing = await clients.investor.listPositions(requestGraphId, {
          portfolioId: requestPortfolioId,
          securityId: pendingSecurity.id,
        })
        if (graphIdRef.current !== requestGraphId) return
        if ((existing?.positions ?? []).length > 0) {
          finish()
          return
        }

        const previous = pendingSecurity.fields
        const keys = Object.keys(fields) as Array<keyof SecurityFields>
        const changed = keys.filter((k) => fields[k] !== previous[k])
        // Only descriptive fields are patched. The company link is resolved
        // by the server on create (from the source graph), and an update just
        // copies fields — so a changed link goes through a fresh create.
        const patchable = new Set<keyof SecurityFields>([
          'name',
          'security_type',
          'security_subtype',
        ])
        if (changed.length === 0) {
          securityId = pendingSecurity.id
        } else if (changed.some((k) => !patchable.has(k) || !fields[k])) {
          // Retire the unpositioned security rather than leave it behind,
          // then create the new one.
          await clients.investor.deleteSecurity(
            requestGraphId,
            pendingSecurity.id
          )
          if (graphIdRef.current !== requestGraphId) return
          setPendingSecurity(null)
          securityId = await created()
        } else {
          // Edited before the retry (a typo fixed): correct the security this
          // session already created instead of minting a second one.
          await clients.investor.updateSecurity(
            requestGraphId,
            pendingSecurity.id,
            Object.fromEntries(changed.map((k) => [k, fields[k]]))
          )
          securityId = pendingSecurity.id
        }
      }
      if (graphIdRef.current !== requestGraphId) return
      setPendingSecurity({ id: securityId, fields })

      // 2. Add the position. Both ids were captured together, so this cannot
      // post one graph's portfolio id against another graph.
      await clients.investor.updatePortfolioBlock(
        requestGraphId,
        requestPortfolioId,
        {
          positions: {
            add: [
              {
                security_id: securityId,
                quantity,
                quantity_type: securityForm.quantity_type,
                cost_basis: costBasis,
              },
            ],
          },
        }
      )

      if (graphIdRef.current !== requestGraphId) return
      finish()
    } catch (err) {
      if (graphIdRef.current !== requestGraphId) return
      setSecurityModalError(
        err instanceof Error ? err.message : 'Failed to create security'
      )
    } finally {
      if (graphIdRef.current === requestGraphId) setCreatingSecurity(false)
    }
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setCreateModalError(null)
  }

  const closeSecurityModal = () => {
    // The form and any security already created for it stay, so reopening and
    // adding again finishes that security rather than creating another.
    setShowSecurityModal(false)
  }

  // No graph with roboinvestor extension
  if (!graphId && !isLoading) {
    return (
      <PageLayout>
        <Card>
          <EmptyState
            icon={HiViewGrid}
            title="No Portfolio Graph"
            description={
              <>
                Create a graph with the <code>roboinvestor</code> schema
                extension to get started with portfolio management.
              </>
            }
            className="py-8"
          />
        </Card>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        icon={HiViewGrid}
        title="Portfolio"
        subtitle={
          <>
            Manage your investment portfolios and holdings.{' '}
            <DocsLink href="/docs/your-portfolio" />
          </>
        }
        actions={
          <Button
            color="secondary"
            onClick={() => {
              setCreateModalError(null)
              setShowCreateModal(true)
            }}
            disabled={isLoading}
          >
            <HiPlus className="mr-2 h-4 w-4" />
            New Portfolio
          </Button>
        }
      />

      {error && (
        <Alert color="failure" icon={HiExclamationCircle}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <LoadingState size="xl" />
      ) : portfolios.length === 0 ? (
        <Card>
          <EmptyState
            icon={HiViewGrid}
            title="No Portfolios Yet"
            description="Create your first portfolio to start tracking investments."
            className="py-8"
          />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Portfolio list sidebar */}
          <div className="min-w-0 space-y-3">
            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Portfolios
            </h2>
            {portfolios.map((p) => (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all ${
                  activeSelection?.id === p.id
                    ? 'ring-secondary-500 ring-2'
                    : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                }`}
                onClick={() => {
                  setSelectedPortfolio(p)
                  setSelectionGraphId(graphId)
                }}
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
          <div className="min-w-0 lg:col-span-2">
            {activeSelection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {activeSelection.name}
                  </h2>
                  <Button
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      setSecurityModalError(null)
                      // Keep the form only while a written security awaits
                      // its position; otherwise a reopen starts clean.
                      if (!pendingSecurity) setSecurityForm(emptySecurityForm)
                      loadLinkedEntities()
                      setShowSecurityModal(true)
                    }}
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Security
                  </Button>
                </div>

                {holdingsError && (
                  <Alert color="failure" icon={HiExclamationCircle}>
                    {holdingsError}
                  </Alert>
                )}

                {holdingsLoading ? (
                  <LoadingState className="py-8" />
                ) : holdings.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon={HiOfficeBuilding}
                      title="No holdings yet"
                      description="Add entities, securities, and positions via the API to see them here."
                      className="py-6"
                    />
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {holdings.map((h) => (
                      <Card key={h.entity_id}>
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-3">
                              <HiOfficeBuilding className="text-secondary-500 h-5 w-5 shrink-0" />
                              <h3 className="min-w-0 text-lg font-semibold break-words text-gray-900 dark:text-white">
                                {h.entity_name}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Cost:{' '}
                                {formatCurrency(
                                  h.total_cost_basis_dollars,
                                  activeSelection.base_currency
                                )}
                              </span>
                              {h.total_current_value_dollars != null && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Value:{' '}
                                  {formatCurrency(
                                    h.total_current_value_dollars,
                                    activeSelection.base_currency
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {h.source_graph_id && (
                            <Badge color="info" className="text-xs">
                              Linked graph:{' '}
                              <span className="break-all">
                                {h.source_graph_id}
                              </span>
                            </Badge>
                          )}

                          <div className="overflow-x-auto">
                            <Table>
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
                                      {formatCurrency(
                                        s.cost_basis_dollars,
                                        activeSelection.base_currency
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {s.current_value_dollars != null ? (
                                        <span className="flex items-center gap-1">
                                          <HiCurrencyDollar className="h-4 w-4 text-green-500" />
                                          {formatCurrency(
                                            s.current_value_dollars,
                                            activeSelection.base_currency
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">
                                          --
                                        </span>
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
                                        className="hover:text-secondary-500 rounded p-1 text-gray-400"
                                        aria-label={`Link ${s.security_name}`}
                                      >
                                        <HiPencil className="h-4 w-4" />
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center">
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
      <Modal show={showCreateModal} onClose={closeCreateModal} size="md">
        <ModalHeader>Create Portfolio</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {createModalError && (
              <Alert color="failure" icon={HiExclamationCircle}>
                {createModalError}
              </Alert>
            )}
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
            color="secondary"
            onClick={handleCreate}
            disabled={creating || !createForm.name.trim()}
          >
            {creating ? (
              <Spinner size="sm" className="mr-2 text-white" />
            ) : null}
            Create
          </Button>
          <Button color="gray" onClick={closeCreateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Security Modal */}
      <Modal show={showSecurityModal} onClose={closeSecurityModal} size="md">
        <ModalHeader>Add Security</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {securityModalError && (
              <Alert color="failure" icon={HiExclamationCircle}>
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
              <Select
                id="sec-type"
                value={securityForm.security_type}
                onChange={(e) =>
                  setSecurityForm((f) => ({
                    ...f,
                    security_type: e.target.value,
                  }))
                }
              >
                {securityTypeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
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
                <Select
                  id="sec-entity"
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
                </Select>
              ) : entitiesError ? (
                <p className="py-2 text-sm text-red-600 dark:text-red-400">
                  {entitiesError}
                </p>
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
              Position
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sec-qty">Quantity</Label>
                <TextInput
                  id="sec-qty"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
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
                <Select
                  id="sec-qty-type"
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
                  <option value="principal">Principal</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="sec-cost">Cost Basis (optional)</Label>
              <TextInput
                id="sec-cost"
                type="text"
                inputMode="decimal"
                autoComplete="off"
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
            color="secondary"
            onClick={handleCreateSecurity}
            disabled={creatingSecurity || !securityForm.name.trim()}
          >
            {creatingSecurity ? (
              <Spinner size="sm" className="mr-2 text-white" />
            ) : null}
            Add
          </Button>
          <Button color="gray" onClick={closeSecurityModal}>
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
              <Alert color="failure" icon={HiExclamationCircle}>
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
                <Select
                  id="edit-entity"
                  value={editEntityId}
                  onChange={(e) => {
                    const entityId = e.target.value
                    const entity = linkedEntities.find(
                      (ent) => ent.id === entityId
                    )
                    editTouched.current = true
                    setEditEntityId(entityId)
                    if (entity?.source_graph_id) {
                      setEditSourceGraphId(entity.source_graph_id)
                    }
                  }}
                >
                  <option value="">No company linked</option>
                  {editLoaded.entityId &&
                    !linkedEntities.some(
                      (ent) => ent.id === editLoaded.entityId
                    ) && (
                      <option value={editLoaded.entityId}>
                        Current link ({editLoaded.entityId})
                      </option>
                    )}
                  {linkedEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </Select>
              ) : entitiesError ? (
                <p className="py-2 text-sm text-red-600 dark:text-red-400">
                  {entitiesError}
                </p>
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
                onChange={(e) => {
                  editTouched.current = true
                  setEditSourceGraphId(e.target.value)
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleEditSecurity}
            disabled={
              savingEdit ||
              !(
                (editEntityId && editEntityId !== editLoaded.entityId) ||
                (editSourceGraphId.trim() &&
                  editSourceGraphId.trim() !== editLoaded.sourceGraphId)
              )
            }
          >
            {savingEdit ? (
              <Spinner size="sm" className="mr-2 text-white" />
            ) : null}
            Save
          </Button>
          <Button color="gray" onClick={() => setShowEditSecurityModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </PageLayout>
  )
}

export default PortfolioPageContent
