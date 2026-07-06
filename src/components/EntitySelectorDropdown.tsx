'use client'

import type { Entity } from '@/lib/core'
import {
  clients,
  GraphFilters,
  onlyRepositories,
  useEntity,
  useGraphContext,
} from '@/lib/core'
import { useSSO } from '@/lib/core/auth-core/sso'
import { useEffect, useMemo, useState } from 'react'
import { HiChevronDown, HiDatabase, HiOfficeBuilding } from 'react-icons/hi'

const API_URL =
  process.env.NEXT_PUBLIC_ROBOSYSTEMS_API_URL || 'http://localhost:8000'

/**
 * EntitySelectorDropdown for RoboInvestor
 *
 * Shows all entities across all roboinvestor graphs, plus any shared
 * repositories the user has access to (e.g. the SEC graph). Selecting an
 * entity switches to its graph; selecting a shared repository switches to it
 * directly (repositories have no per-user entity) so Console and Search can
 * be used against it.
 */
export function EntitySelectorDropdown() {
  const { state: graphState, setCurrentGraph } = useGraphContext()
  const { currentEntity, setCurrentEntity, clearEntity } = useEntity()
  const { navigateToApp } = useSSO(API_URL)
  const [isOpen, setIsOpen] = useState(false)
  const [entitiesByGraph, setEntitiesByGraph] = useState<Map<string, Entity[]>>(
    new Map()
  )
  const [isLoading, setIsLoading] = useState(false)

  // Filter to only roboinvestor graphs
  const roboinvestorGraphs = useMemo(
    () => graphState.graphs.filter(GraphFilters.roboinvestor),
    [graphState.graphs]
  )

  // Shared repositories the user has access to (e.g. SEC)
  const repositories = useMemo(
    () => graphState.graphs.filter(onlyRepositories),
    [graphState.graphs]
  )

  // Load entities for all roboinvestor graphs via the ledger entity API — the
  // same source roboledger uses. A previous raw Cypher `MATCH (e:Entity)` read
  // only materialized graph nodes, so it missed entities that exist at the
  // API/registry level but were never written as a node (e.g. a freshly created
  // graph). That left such graphs entity-less and invisible in the selector.
  // Exclude `linked` entities (portfolio holdings shared from other graphs) —
  // those are holdings, not selection targets.
  useEffect(() => {
    const loadAllEntities = async () => {
      setIsLoading(true)
      const entitiesMap = new Map<string, Entity[]>()

      await Promise.all(
        roboinvestorGraphs.map(async (graph) => {
          try {
            const list = await clients.ledger.listEntities(graph.graphId)
            const entities: Entity[] = list
              .filter((e) => e.source !== 'linked')
              .map((e) => ({
                identifier: e.id || '',
                name: e.name || e.id || 'Unnamed Entity',
                parentEntityId: e.parentEntityId ?? null,
                isParent: e.isParent ?? null,
              }))

            if (entities.length > 0) {
              entitiesMap.set(graph.graphId, entities)
            }
          } catch (error) {
            console.error(
              `Failed to load entities for graph ${graph.graphId}:`,
              error
            )
          }
        })
      )

      setEntitiesByGraph(entitiesMap)
      setIsLoading(false)
    }

    if (roboinvestorGraphs.length > 0) {
      loadAllEntities()
    }
  }, [roboinvestorGraphs]) // Only reload when graphs change, not on every entity selection

  const handleEntitySelect = async (entity: Entity, graphId: string) => {
    setIsOpen(false)

    // Switch graph if different from current
    if (graphId !== graphState.currentGraphId) {
      await setCurrentGraph(graphId)
    }

    // Set the selected entity
    setCurrentEntity(entity)
  }

  const handleRepositorySelect = async (graphId: string) => {
    setIsOpen(false)

    // Switch graph if different from current
    if (graphId !== graphState.currentGraphId) {
      await setCurrentGraph(graphId)
    }

    // Repositories have no per-user entity, so clear any entity selection
    clearEntity()
  }

  // Select a roboinvestor graph that has no entities yet. Switches to the graph
  // and clears any entity selection so the rest of the app (Portfolio, Console)
  // operates on it. Keeps freshly created graphs reachable from the selector
  // even before an entity exists in them.
  const handleGraphSelect = async (graphId: string) => {
    setIsOpen(false)

    if (graphId !== graphState.currentGraphId) {
      await setCurrentGraph(graphId)
    }

    clearEntity()
  }

  // The current graph, when it is a shared repository (e.g. SEC)
  const currentRepo = useMemo(
    () => repositories.find((r) => r.graphId === graphState.currentGraphId),
    [repositories, graphState.currentGraphId]
  )

  // The current graph, when it is a roboinvestor entity graph. It may not have
  // an entity selected yet (e.g. a newly created graph with no Entity node).
  const currentInvestorGraph = useMemo(
    () =>
      roboinvestorGraphs.find((g) => g.graphId === graphState.currentGraphId),
    [roboinvestorGraphs, graphState.currentGraphId]
  )

  // Calculate total entities across all graphs
  const totalEntities = Array.from(entitiesByGraph.values()).reduce(
    (sum, entities) => sum + entities.length,
    0
  )

  // Determine empty state
  const hasNoGraphs =
    roboinvestorGraphs.length === 0 && repositories.length === 0
  const hasNothingToSelect =
    !isLoading &&
    totalEntities === 0 &&
    repositories.length === 0 &&
    roboinvestorGraphs.length === 0

  // Label shown on the trigger button
  const buttonLabel = currentRepo
    ? currentRepo.graphName
    : currentEntity?.name || currentInvestorGraph?.graphName || 'Select Entity'
  const ButtonIcon = currentRepo ? HiDatabase : HiOfficeBuilding

  // If no graphs at all, link to platform to create one
  if (hasNoGraphs) {
    return (
      <button
        onClick={() => navigateToApp('robosystems', '/graphs/new')}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <HiOfficeBuilding className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          Create Graph
        </span>
      </button>
    )
  }

  // Repositories to list (exclude the one that is currently selected — it is
  // shown in the "Current Selection" block instead)
  const otherRepositories = repositories.filter(
    (r) => r.graphId !== graphState.currentGraphId
  )

  return (
    <div className="relative">
      <button
        onClick={() => !hasNothingToSelect && setIsOpen(!isOpen)}
        disabled={hasNothingToSelect}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-700"
      >
        <ButtonIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {buttonLabel}
        </span>
        <HiChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false)
            }}
            role="button"
            tabIndex={0}
            aria-label="Close entity selector"
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  Loading entities...
                </div>
              ) : (
                <>
                  {/* Currently selected repository at the top */}
                  {currentRepo && (
                    <div className="border-b-2 border-gray-300 dark:border-gray-500">
                      <div className="bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Current Selection
                      </div>
                      <button
                        onClick={() =>
                          handleRepositorySelect(currentRepo.graphId)
                        }
                        className="flex w-full items-center gap-2 bg-blue-50 px-4 py-2 text-left hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/40"
                      >
                        <HiDatabase className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {currentRepo.graphName}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Shared Repository
                            {currentRepo.role && ` • ${currentRepo.role}`}
                          </span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Currently selected entity at the top */}
                  {!currentRepo &&
                    currentEntity &&
                    graphState.currentGraphId &&
                    (() => {
                      const currentGraphEntities =
                        entitiesByGraph.get(graphState.currentGraphId) || []
                      const selectedEntity = currentGraphEntities.find(
                        (e) => e.identifier === currentEntity.identifier
                      )
                      const selectedGraph = roboinvestorGraphs.find(
                        (g) => g.graphId === graphState.currentGraphId
                      )

                      if (selectedEntity && selectedGraph) {
                        return (
                          <>
                            <div className="border-b-2 border-gray-300 dark:border-gray-500">
                              <div className="bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Current Selection
                              </div>
                              <button
                                onClick={() =>
                                  handleEntitySelect(
                                    selectedEntity,
                                    selectedGraph.graphId
                                  )
                                }
                                className="w-full bg-blue-50 px-4 py-2 text-left hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/40"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    {selectedEntity.name}
                                  </span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {selectedGraph.graphName}
                                    {selectedEntity.parentEntityId &&
                                      ' • Subsidiary'}
                                    {selectedEntity.isParent && ' • Parent'}
                                  </span>
                                </div>
                              </button>
                            </div>
                          </>
                        )
                      }
                      return null
                    })()}

                  {/* All other entities grouped by graph */}
                  {roboinvestorGraphs.map((graph) => {
                    const entities = entitiesByGraph.get(graph.graphId) || []

                    // A roboinvestor graph with no entities yet (e.g. freshly
                    // created) still needs to be reachable — surface it as a
                    // selectable row so the user can switch to it. Without this
                    // the graph is invisible and the app can't be pointed at it.
                    if (entities.length === 0) {
                      const isCurrent =
                        graphState.currentGraphId === graph.graphId
                      return (
                        <div
                          key={graph.graphId}
                          className="border-b border-gray-200 last:border-0 dark:border-gray-600"
                        >
                          <button
                            onClick={() => handleGraphSelect(graph.graphId)}
                            className={`flex w-full items-center gap-2 px-4 py-2 text-left transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/40'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <HiOfficeBuilding
                              className={`h-4 w-4 shrink-0 ${
                                isCurrent
                                  ? 'text-blue-600 dark:text-blue-300'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            />
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-medium ${
                                  isCurrent
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                {graph.graphName}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {isCurrent
                                  ? 'Selected • no entities yet'
                                  : 'No entities yet'}
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    }

                    // Filter out the currently selected entity
                    const otherEntities = entities.filter(
                      (e) =>
                        !(
                          currentEntity?.identifier === e.identifier &&
                          graphState.currentGraphId === graph.graphId
                        )
                    )

                    if (otherEntities.length === 0) return null

                    return (
                      <div
                        key={graph.graphId}
                        className="border-b border-gray-200 last:border-0 dark:border-gray-600"
                      >
                        {/* Graph header */}
                        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {graph.graphName}
                        </div>

                        {/* Entities */}
                        {otherEntities.map((entity) => (
                          <button
                            key={`${graph.graphId}-${entity.identifier}`}
                            onClick={() =>
                              handleEntitySelect(entity, graph.graphId)
                            }
                            className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {entity.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {entity.identifier}
                                {entity.parentEntityId && ' • Subsidiary'}
                                {entity.isParent && ' • Parent'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  })}

                  {/* Shared repositories (e.g. SEC) — selectable for Console/Search */}
                  {otherRepositories.length > 0 && (
                    <div className="border-b border-gray-200 last:border-0 dark:border-gray-600">
                      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        Shared Repositories
                      </div>
                      {otherRepositories.map((repo) => (
                        <button
                          key={repo.graphId}
                          onClick={() => handleRepositorySelect(repo.graphId)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HiDatabase className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {repo.graphName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Shared Repository
                              {repo.role && ` • ${repo.role}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Create New Entity — redirects to platform via SSO */}
                  <div className="border-t-2 border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() =>
                        navigateToApp('robosystems', '/graphs/new')
                      }
                      className="flex w-full items-center justify-center px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-700"
                    >
                      + Create New Entity
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
