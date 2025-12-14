'use client'

import type { PropsWithChildren } from 'react'

interface PageContainerProps extends PropsWithChildren {
  spacing?: 'tight' | 'normal' | 'loose'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function PageContainer({
  children,
  spacing = 'normal',
  maxWidth = 'xl',
}: PageContainerProps) {
  const spacingClasses = {
    tight: 'gap-4',
    normal: 'gap-6',
    loose: 'gap-8',
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  }

  return (
    <div
      className={`grid grid-cols-1 px-4 pb-1 ${spacingClasses[spacing]} ${maxWidthClasses[maxWidth]}`}
    >
      {children}
    </div>
  )
}
