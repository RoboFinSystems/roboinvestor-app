'use client'

import { useAuth } from '@/lib/core/auth-components/AuthProvider'
import { Alert, Button, Progress, TextInput } from 'flowbite-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiLockClosed,
} from 'react-icons/hi'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword, validateResetToken } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenEmail, setTokenEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(
    null
  )

  const token = searchParams.get('token')

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false)
        setStatus('error')
        setMessage('No reset token provided')
        return
      }

      try {
        const result = await validateResetToken(token)

        if (result.valid) {
          setTokenValid(true)
          setTokenEmail(result.email || '')
        } else {
          setStatus('error')
          setMessage(result.message || 'Invalid or expired reset token')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to validate reset token')
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token, validateResetToken])

  // Cleanup redirect timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [redirectTimeout])

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 15
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
    if (/[0-9]/.test(pwd)) strength += 20
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match')
      return
    }

    // Validate password strength
    if (passwordStrength < 50) {
      setStatus('error')
      setMessage('Please choose a stronger password')
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('No reset token provided')
      return
    }

    setIsLoading(true)
    setStatus('idle')

    try {
      const result = await resetPassword(token, password)

      if (result.success) {
        setStatus('success')
        setMessage('Password reset successfully! Redirecting...')

        // Redirect after 2 seconds
        const timeoutId = setTimeout(() => {
          router.push('/home')
        }, 2000)
        setRedirectTimeout(timeoutId)
      } else {
        setStatus('error')
        setMessage(result.message || 'Failed to reset password')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'red'
    if (passwordStrength < 50) return 'yellow'
    if (passwordStrength < 75) return 'blue'
    return 'green'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak'
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400">
            Validating reset token...
          </p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="max-w-md text-center">
          <HiExclamationCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Invalid Reset Link
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {message || 'This password reset link is invalid or has expired.'}
          </p>
          <Link href="/auth/forgot-password">
            <Button color="blue">Request New Reset Link</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            {tokenEmail && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                For account: {tokenEmail}
              </p>
            )}
          </div>

          {status === 'success' && (
            <Alert color="success" className="mb-6" icon={HiCheckCircle}>
              {message}
            </Alert>
          )}

          {status === 'error' && (
            <Alert color="failure" className="mb-6" icon={HiExclamationCircle}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <TextInput
                id="password"
                type="password"
                icon={HiLockClosed}
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
                minLength={8}
              />
              {password && (
                <div className="mt-2">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Password strength
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <Progress
                    progress={passwordStrength}
                    size="sm"
                    color={getPasswordStrengthColor()}
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <TextInput
                id="confirmPassword"
                type="password"
                icon={HiLockClosed}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              color="blue"
              className="w-full"
              disabled={
                isLoading ||
                passwordStrength < 50 ||
                password !== confirmPassword
              }
            >
              {isLoading ? (
                <>
                  <div className="mr-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
