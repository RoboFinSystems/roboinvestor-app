'use client'

import {
  EmptyState,
  PageHeader,
  useEntity,
  useGraphContext,
} from '@robosystems/core'
import { Alert, Badge, Card } from 'flowbite-react'
import { type FC } from 'react'
import { HiOfficeBuilding } from 'react-icons/hi'

const EntityInfoPageContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const { currentEntity } = useEntity()

  const currentGraph = graphState.graphs.find(
    (g) => g.graphId === graphState.currentGraphId
  )

  return (
    <>
      <div className="mb-4 px-6 pt-6">
        <PageHeader
          icon={HiOfficeBuilding}
          title="Entity Details"
          subtitle={
            currentEntity?.name || 'View entity information and settings'
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-y-4 px-6 pb-1">
        {!currentEntity ? (
          <Card>
            <EmptyState
              icon={HiOfficeBuilding}
              title="No Entity Selected"
              description="Please select an entity from the Entity selector in the header to view its details."
              className="py-8"
              action={
                !graphState.currentGraphId && (
                  <Alert color="info" className="text-left">
                    <span className="font-medium">No graph selected.</span>{' '}
                    Please select a graph first.
                  </Alert>
                )
              }
            />
          </Card>
        ) : (
          <>
            {/* Entity Overview Card */}
            <Card>
              <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Entity Information
                </h2>
              </div>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="text-base font-semibold text-gray-900 dark:text-white">
                    {currentEntity.name}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Identifier
                  </dt>
                  <dd className="font-mono text-sm text-gray-900 dark:text-white">
                    {currentEntity.identifier}
                  </dd>
                </div>
                {currentEntity.entityType && (
                  <div>
                    <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Entity Type
                    </dt>
                    <dd>
                      <Badge color="gray" size="sm">
                        {currentEntity.entityType}
                      </Badge>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Relationship
                  </dt>
                  <dd>
                    {currentEntity.isParent ? (
                      <Badge color="success" size="sm">
                        Parent Entity
                      </Badge>
                    ) : currentEntity.parentEntityId ? (
                      <div className="flex flex-col gap-1">
                        <Badge color="warning" size="sm">
                          Subsidiary
                        </Badge>
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          Parent: {currentEntity.parentEntityId}
                        </span>
                      </div>
                    ) : (
                      <Badge color="gray" size="sm">
                        Standalone
                      </Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Graph Information Card */}
            {currentGraph && (
              <Card>
                <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Graph Information
                  </h2>
                </div>
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Graph Name
                    </dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-white">
                      {currentGraph.graphName}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Graph ID
                    </dt>
                    <dd className="font-mono text-sm text-gray-900 dark:text-white">
                      {currentGraph.graphId}
                    </dd>
                  </div>
                  {currentGraph.schemaExtensions &&
                    currentGraph.schemaExtensions.length > 0 && (
                      <div>
                        <dt className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Schema Extensions
                        </dt>
                        <dd className="flex flex-wrap gap-2">
                          {currentGraph.schemaExtensions.map((schema) => (
                            <Badge key={schema} color="info" size="sm">
                              {schema}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                </dl>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default EntityInfoPageContent
