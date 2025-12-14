'use client'

import type { Entity } from '@/lib/core'
import { customTheme, GraphFilters, SDK, useGraphContext } from '@/lib/core'
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Card,
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
import { useEffect, useState } from 'react'
import {
  HiExclamationCircle,
  HiHome,
  HiOfficeBuilding,
  HiSearch,
} from 'react-icons/hi'

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

  // Load all entities from all roboinvestor graphs
  useEffect(() => {
    const loadAllEntities = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Filter to only roboinvestor graphs
        const roboinvestorGraphs = graphState.graphs.filter(
          GraphFilters.roboinvestor
        )

        // Load entities from all roboinvestor graphs
        const allEntities: EntityWithGraph[] = []

        for (const graph of roboinvestorGraphs) {
          try {
            const response = await SDK.executeCypherQuery({
              path: { graph_id: graph.graphId },
              query: { mode: 'sync' },
              body: {
                query: `MATCH (e:Entity)
                        RETURN
                          e.identifier as identifier,
                          e.name as name,
                          e.entity_type as entityType,
                          e.parent_entity_id as parentEntityId,
                          e.is_parent as isParent
                        ORDER BY e.name`,
                parameters: {},
              },
            })

            if (response.data) {
              const data = response.data as any
              const rows = data.data || []

              const graphEntities: EntityWithGraph[] = rows.map((row: any) => ({
                identifier: row.identifier || '',
                name: row.name || row.identifier || 'Unnamed Entity',
                entityType: row.entityType,
                parentEntityId: row.parentEntityId,
                isParent: row.isParent,
                _graphId: graph.graphId,
                _graphName: graph.graphName,
                _graphCreatedAt: graph.createdAt,
              }))

              allEntities.push(...graphEntities)
            }
          } catch (error) {
            console.error(
              `Error loading entities from graph ${graph.graphName}:`,
              error
            )
          }
        }

        setEntities(allEntities)
      } catch (error) {
        console.error('Error loading entities:', error)
        setError('Failed to load entities. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAllEntities()
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
      <div className="block items-center justify-between border-b border-gray-200 p-4 sm:flex dark:border-gray-700">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-5">
              <BreadcrumbItem href="/home">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem href="/entities">Entities</BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="font-heading text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              All Entities ({entities.length})
            </h1>
          </div>
          <div className="block items-center gap-4 sm:flex">
            <div className="mb-4 flex flex-1 sm:mb-0">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiSearch className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput
                  theme={customTheme.textInput}
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
          <Alert theme={customTheme.alert} color="failure">
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
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : entities.length === 0 ? (
                <div className="p-8 text-center">
                  <Card theme={customTheme.card}>
                    <HiOfficeBuilding className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="font-heading mb-4 text-xl font-bold dark:text-white">
                      No Entities Found
                    </h3>
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                      No entities found in your roboinvestor graphs.
                    </p>
                  </Card>
                </div>
              ) : (
                <Table theme={customTheme.table}>
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
