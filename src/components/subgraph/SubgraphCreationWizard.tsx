'use client'

import { useToast } from '@/lib/core'
import { customTheme } from '@/lib/core/theme'
import { client, createSubgraph } from '@robosystems/client'
import { Alert, Button, Card, Progress } from 'flowbite-react'
import { useState } from 'react'
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiInformationCircle,
} from 'react-icons/hi'
import { SubgraphInfoStep } from './steps/SubgraphInfoStep'
import { SubgraphReviewStep } from './steps/SubgraphReviewStep'

interface SubgraphFormData {
  name: string
  displayName: string
  description: string
}

interface SubgraphCreationWizardProps {
  graphId: string
  onCancel: () => void
  onSuccess: (subgraphName: string) => void
  className?: string
}

const steps = [
  {
    id: 'info',
    title: 'Subgraph Information',
    description: 'Configure your subgraph details',
  },
  {
    id: 'review',
    title: 'Review & Create',
    description: 'Review your configuration and create the subgraph',
  },
]

export function SubgraphCreationWizard({
  graphId,
  onCancel,
  onSuccess,
  className = '',
}: SubgraphCreationWizardProps) {
  const { showSuccess, showError } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<SubgraphFormData>({
    name: '',
    displayName: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      // Validate subgraph info
      if (!formData.name.trim()) {
        newErrors.name = 'Subgraph name is required'
      } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
        newErrors.name = 'Name must be lowercase alphanumeric with hyphens only'
      } else if (formData.name.length < 3) {
        newErrors.name = 'Name must be at least 3 characters'
      } else if (formData.name.length > 50) {
        newErrors.name = 'Name must be less than 50 characters'
      }

      if (!formData.displayName.trim()) {
        newErrors.displayName = 'Display name is required'
      } else if (formData.displayName.length > 100) {
        newErrors.displayName = 'Display name must be less than 100 characters'
      }

      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleCreate = async () => {
    if (!validateCurrentStep()) return

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
        onSuccess(formData.name)
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

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={className}>
      <Card theme={customTheme.card} className="overflow-hidden">
        {/* Progress Header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress
              progress={progress}
              size="sm"
              className="mt-2"
              theme={customTheme.progress}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 0 && (
            <SubgraphInfoStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentStep === 1 && (
            <SubgraphReviewStep formData={formData} graphId={graphId} />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 p-6 dark:border-gray-700">
          <div className="flex space-x-3">
            <Button
              color="gray"
              onClick={currentStep === 0 ? onCancel : handlePrevious}
              theme={customTheme.button}
              disabled={isCreating}
            >
              {currentStep === 0 ? (
                <>Cancel</>
              ) : (
                <>
                  <HiArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </>
              )}
            </Button>
          </div>

          <div className="flex space-x-3">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                theme={customTheme.button}
                disabled={isCreating}
              >
                Next
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                theme={customTheme.button}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <HiCheck className="mr-2 h-4 w-4" />
                    Create Subgraph
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Info Alert */}
      <Alert
        color="info"
        icon={HiInformationCircle}
        className="mt-6"
        theme={customTheme.alert}
      >
        <span className="font-medium">About Subgraphs:</span> Subgraphs are
        isolated graph environments within your main graph. Use them for AI
        memory and knowledge graphs, data workspaces with fork and publish
        workflows, or development and testing environments.
      </Alert>
    </div>
  )
}

export default SubgraphCreationWizard
