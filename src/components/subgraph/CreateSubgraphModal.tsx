'use client'

import { customTheme, useToast } from '@/lib/core'
import { client, createSubgraph } from '@robosystems/client'
import { Button, Label, Textarea, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'

interface CreateSubgraphModalProps {
  graphId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: (subgraphName: string) => void
}

export function CreateSubgraphModal({
  graphId,
  isOpen,
  onClose,
  onSuccess,
}: CreateSubgraphModalProps) {
  const { showSuccess, showError } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name (alphanumeric, lowercase, hyphens allowed)
    if (!formData.name) {
      newErrors.name = 'Subgraph name is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Name must be lowercase alphanumeric with hyphens only'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters'
    }

    // Validate display name
    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required'
    } else if (formData.displayName.length > 100) {
      newErrors.displayName = 'Display name must be less than 100 characters'
    }

    // Validate description (optional)
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsCreating(true)

    try {
      // Configure client
      client.setConfig({
        baseUrl:
          process.env.NEXT_PUBLIC_ROBOSYSTEMS_API_URL ||
          'http://localhost:8000',
        credentials: 'include',
      })

      // Create the subgraph
      const response = await createSubgraph({
        client,
        path: {
          graph_id: graphId,
        },
        body: {
          name: formData.name,
          display_name: formData.displayName,
          description: formData.description || undefined,
        },
      })

      if (response.data) {
        showSuccess(`Subgraph "${formData.displayName}" created successfully`)

        // Call success callback
        if (onSuccess) {
          onSuccess(formData.name)
        }

        // Reset form and close modal
        setFormData({ name: '', displayName: '', description: '' })
        setErrors({})
        onClose()
      }
    } catch (error: any) {
      console.error('Failed to create subgraph:', error)

      // Handle specific error cases
      if (error.status === 400) {
        showError('Invalid subgraph configuration. Please check your inputs.')
      } else if (error.status === 403) {
        showError(
          'Your current tier does not support subgraphs. Please upgrade.'
        )
      } else if (error.status === 409) {
        showError('A subgraph with this name already exists.')
        setErrors({ name: 'This name is already taken' })
      } else {
        showError(error.message || 'Failed to create subgraph')
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setFormData({ name: '', displayName: '', description: '' })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900">
      <div className="relative max-h-full w-full max-w-lg p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Subgraph
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              disabled={isCreating}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info Alert */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                  <HiInformationCircle className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      About Subgraphs
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        Subgraphs are isolated graph environments within your
                        main graph. Use them for:
                      </p>
                      <ul className="mt-1 list-inside list-disc">
                        <li>
                          AI memory and knowledge graphs — give agents
                          persistent memory with built-in schema
                        </li>
                        <li>
                          Data workspaces — fork your data, build mappings or
                          transformations, then publish back
                        </li>
                        <li>
                          Development and testing — experiment without affecting
                          production
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name">Subgraph Name</Label>
                  <span className="ml-1 text-xs text-gray-500">
                    (lowercase, alphanumeric, hyphens)
                  </span>
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="e.g., memory, research, staging"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.toLowerCase(),
                    })
                  }
                  color={errors.name ? 'failure' : undefined}
                  required
                  disabled={isCreating}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Display Name Field */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="displayName">Display Name</Label>
                </div>
                <TextInput
                  id="displayName"
                  type="text"
                  placeholder="e.g., Development Environment"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  color={errors.displayName ? 'failure' : undefined}
                  required
                  disabled={isCreating}
                />
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description">Description (Optional)</Label>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this subgraph..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  color={errors.description ? 'failure' : undefined}
                  disabled={isCreating}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>
            </form>
          </div>
          {/* Modal footer */}
          <div className="flex items-center rounded-b border-t border-gray-200 p-4 md:p-5 dark:border-gray-600">
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={isCreating}
              theme={customTheme.button}
            >
              {isCreating ? 'Creating...' : 'Create Subgraph'}
            </Button>
            <Button
              color="gray"
              onClick={handleClose}
              disabled={isCreating}
              theme={customTheme.button}
              className="ml-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateSubgraphModal
