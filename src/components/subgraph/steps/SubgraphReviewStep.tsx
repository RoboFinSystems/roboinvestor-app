'use client'

import { customTheme } from '@/lib/core/theme'
import { Card } from 'flowbite-react'
import { HiChip, HiInformationCircle } from 'react-icons/hi'

interface SubgraphFormData {
  name: string
  displayName: string
  description: string
}

interface SubgraphReviewStepProps {
  formData: SubgraphFormData
  graphId: string
}

export function SubgraphReviewStep({
  formData,
  graphId,
}: SubgraphReviewStepProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card theme={customTheme.card}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <HiChip className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formData.displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subgraph Name: <span className="font-mono">{formData.name}</span>
            </p>
            {formData.description && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {formData.description}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Configuration Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Configuration Summary
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Parent Graph
            </dt>
            <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
              {graphId}
            </dd>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Subgraph Name
            </dt>
            <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
              {formData.name}
            </dd>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Display Name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formData.displayName}
            </dd>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formData.description || 'No description provided'}
            </dd>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex">
          <HiInformationCircle className="h-5 w-5 text-amber-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Before You Continue
            </h3>
            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              <ul className="list-inside list-disc space-y-1">
                <li>The subgraph will be created as an isolated environment</li>
                <li>Data in the subgraph is isolated from the parent graph</li>
                <li>You can manage and write data independently</li>
                <li>Make sure the subgraph name is unique and descriptive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ready to create your subgraph? Click "Create Subgraph" to proceed.
        </p>
      </div>
    </div>
  )
}
