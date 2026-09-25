'use client'

import type { Entity } from '@robosystems/core'
import {
  clients,
  EmptyState,
  GraphFilters,
  LoadingState,
  PageHeader,
  useGraphContext,
} from '@robosystems/core'
import {
  Alert,
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'flowbite-react'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { HiExclamationCircle, HiOfficeBuilding, HiSearch } from 'react-icons/hi'

interface EntityWithGraph extends Entity {
  _graphId: string
  _graphName: string
  _graphCreatedAt?: string
}

const EntitiesListPageContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const [entities, setEntities] = useState<EntityWithGraph[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load each RoboInvestor graph's own entities through the ledger entity
  // API — the same source and the same rule as the entity selector. A raw
  // `MATCH (e:Entity)` read only materialized nodes (so a fresh graph listed
  // nothing) and counted `linked` portfolio companies as the fund's own. The
  // facade throws on an API error, so a failed graph is reported, not shown
  // as an empty one.
  useEffect(() => {
    let cancelled = false
    const loadAllEntities = async () => {
      setIsLoading(true)
      setError(null)

      const roboinvestorGraphs = graphState.graphs.filter(
        GraphFilters.roboinvestor
      )

      const results = await Promise.allSettled(
        roboinvestorGraphs.map(async (graph) => {
          const list = await clients.ledger.listEntities(graph.graphId)
          return list
            .filter((e) => e.source !== 'linked')
            .map((e): EntityWithGraph => ({
              identifier: e.id || '',
              name: e.name || e.id || 'Unnamed Entity',
              entityType: e.entityType ?? undefined,
              parentEntityId: e.parentEntityId ?? undefined,
              isParent: e.isParent ?? undefined,
              _graphId: graph.graphId,
              _graphName: graph.graphName,
              _graphCreatedAt: graph.createdAt,
            }))
        })
      )
      if (cancelled) return

      const failed = roboinvestorGraphs.filter(
        (_, i) => results[i].status === 'rejected'
      )
      setEntities(
        results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      )
      if (failed.length > 0) {
        setError(
          `Could not load entities from ${failed
            .map((g) => g.graphName)
            .join(', ')}. Please try again.`
        )
      }
      setIsLoading(false)
    }

    loadAllEntities()
    return () => {
      cancelled = true
    }
  }, [graphState.graphs])

  // Filter entities based on search term
  const filteredEntities = entities.filter(
    (entity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity._graphName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 p-6 sm:flex dark:border-gray-700">
        <div className="mb-1 w-full">
          <PageHeader
            icon={HiOfficeBuilding}
            title={`All Entities (${entities.length})`}
            className="mb-4"
          />
          <div className="block items-center gap-4 sm:flex">
            <div className="mb-4 flex flex-1 sm:mb-0">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiSearch className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput
                  id="search"
                  placeholder="Search entities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <Alert color="failure">
            <HiExclamationCircle className="h-4 w-4" />
            <span className="font-medium">Error!</span> {error}
          </Alert>
        </div>
      )}

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {isLoading ? (
                <LoadingState />
              ) : entities.length === 0 ? (
                <div className="p-8">
                  <Card>
                    <EmptyState
                      icon={HiOfficeBuilding}
                      title="No Entities Found"
                      description="No entities found in your roboinvestor graphs."
                    />
                  </Card>
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableHeadCell>Entity</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Graph</TableHeadCell>
                    <TableHeadCell>Relationship</TableHeadCell>
                    <TableHeadCell>Created</TableHeadCell>
                  </TableHead>
                  <TableBody>
                    {filteredEntities.map((entity) => (
                      <TableRow key={`${entity._graphId}-${entity.identifier}`}>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          <div className="flex flex-col">
                            <span className="font-semibold">{entity.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {entity.identifier}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {entity.entityType ? (
                            <Badge color="gray" size="sm">
                              {entity.entityType}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge color="info" size="sm" className="font-mono">
                            {entity._graphName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entity.isParent ? (
                            <Badge color="success" size="sm">
                              Parent
                            </Badge>
                          ) : entity.parentEntityId ? (
                            <Badge color="warning" size="sm">
                              Subsidiary
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Standalone
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {entity._graphCreatedAt
                              ? new Date(
                                  entity._graphCreatedAt
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EntitiesListPageContent
