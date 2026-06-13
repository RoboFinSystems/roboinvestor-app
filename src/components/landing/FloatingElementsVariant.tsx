interface FloatingElementsVariantProps {
  variant?: 'default' | 'hero' | 'features' | 'schema' | 'ai-analysis' | 'final'
}

export default function FloatingElementsVariant({
  variant = 'default',
}: FloatingElementsVariantProps) {
  switch (variant) {
    case 'hero':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow from-primary-600/20 to-secondary-600/20 absolute top-0 right-1/4 h-[700px] w-[700px] rounded-full bg-linear-to-br blur-3xl"></div>
          <div className="animate-float-slower from-secondary-600/15 to-accent-600/15 absolute -bottom-40 -left-40 h-[800px] w-[800px] rounded-full bg-linear-to-br blur-3xl"></div>
          <div className="animate-float from-primary-600/10 absolute top-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-linear-to-br to-green-600/10 blur-3xl"></div>
        </div>
      )

    case 'features':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float bg-primary-500/10 absolute -top-40 left-1/4 h-80 w-80 rounded-full blur-3xl"></div>
          <div className="animate-float-slow bg-secondary-500/10 absolute right-1/4 -bottom-40 h-80 w-80 rounded-full blur-3xl"></div>
        </div>
      )

    case 'schema':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float from-secondary-600/12 to-primary-600/12 absolute -top-20 right-1/4 h-[450px] w-[450px] rounded-full bg-linear-to-br blur-3xl"></div>
          <div className="animate-float-slow from-accent-600/8 to-secondary-600/8 absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-linear-to-br blur-3xl"></div>
        </div>
      )

    case 'ai-analysis':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow from-primary-600/15 to-secondary-600/15 absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-linear-to-br blur-3xl"></div>
          <div className="animate-float-slower from-accent-600/15 to-secondary-600/15 absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-linear-to-br blur-3xl"></div>
          <div className="animate-float from-secondary-600/10 absolute top-3/4 left-1/3 h-[400px] w-[400px] rounded-full bg-linear-to-br to-green-600/10 blur-3xl"></div>
        </div>
      )

    case 'final':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower from-primary-500/10 to-secondary-500/10 absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br blur-3xl"></div>
        </div>
      )

    default:
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow bg-primary-500/20 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl"></div>
          <div className="animate-float-slower bg-secondary-500/20 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl"></div>
          <div className="animate-float bg-accent-500/20 absolute top-1/2 left-1/2 h-80 w-80 rounded-full blur-3xl"></div>
        </div>
      )
  }
}
