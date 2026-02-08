'use client'

import { customTheme } from '@/lib/core/theme'
import { Alert, Label, Textarea, TextInput } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'

interface SubgraphFormData {
  name: string
  displayName: string
  description: string
}

interface SubgraphInfoStepProps {
  formData: SubgraphFormData
  setFormData: (data: SubgraphFormData) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
}

export function SubgraphInfoStep({
  formData,
  setFormData,
  errors,
  setErrors,
}: SubgraphInfoStepProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setFormData({ ...formData, name: value })
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({ ...errors, name: '' })
    }
  }

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, displayName: e.target.value })
    if (errors.displayName) {
      setErrors({ ...errors, displayName: '' })
    }
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, description: e.target.value })
    if (errors.description) {
      setErrors({ ...errors, description: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert color="info" icon={HiInformationCircle} theme={customTheme.alert}>
        <div>
          <span className="font-medium">Subgraph Configuration</span>
          <div className="mt-2 text-sm">
            <p className="mb-2">
              Configure your subgraph with a unique name and description:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Names must be lowercase, alphanumeric with hyphens</li>
              <li>Display names can contain any characters</li>
              <li>Descriptions help team members understand the purpose</li>
            </ul>
          </div>
        </div>
      </Alert>

      {/* Subgraph Name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="subgraph-name" className="text-sm font-medium">
            Subgraph Name *
          </Label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (lowercase, alphanumeric, hyphens)
          </span>
        </div>
        <TextInput
          id="subgraph-name"
          type="text"
          placeholder="e.g., memory, research, staging"
          value={formData.name}
          onChange={handleNameChange}
          color={errors.name ? 'failure' : undefined}
          theme={customTheme.textInput}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This will be the unique identifier for your subgraph within the parent
          graph.
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="display-name" className="text-sm font-medium">
          Display Name *
        </Label>
        <TextInput
          id="display-name"
          type="text"
          placeholder="e.g., Development Environment, Staging Server"
          value={formData.displayName}
          onChange={handleDisplayNameChange}
          color={errors.displayName ? 'failure' : undefined}
          theme={customTheme.textInput}
          required
        />
        {errors.displayName && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.displayName}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          A human-readable name that will be displayed in the interface.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-gray-400">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the purpose and use case for this subgraph..."
          value={formData.description}
          onChange={handleDescriptionChange}
          rows={4}
          color={errors.description ? 'failure' : undefined}
          theme={customTheme.textarea}
        />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Help your team understand when and how to use this subgraph.
        </p>
      </div>
    </div>
  )
}
