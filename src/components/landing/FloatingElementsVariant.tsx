interface FloatingElementsVariantProps {
  variant?:
    | 'default'
    | 'pricing'
    | 'features'
    | 'final'
    | 'demo'
    | 'platform'
    | 'platform-graph'
    | 'platform-console'
    | 'platform-schema'
    | 'platform-business'
    | 'platform-investment'
    | 'hero'
    | 'product'
    | 'sec-repository'
    | 'applications'
    | 'integrations'
    | 'opensource'
    | 'os-getting-started'
    | 'os-use-cases'
    | 'os-client-libs'
    | 'os-aws'
  intensity?: number
}

export default function FloatingElementsVariant({
  variant = 'default',
}: FloatingElementsVariantProps) {
  // Note: intensity parameter removed - all variants now use hardcoded opacity values
  // via Tailwind's /[value] syntax (e.g., bg-cyan-500/20)
  // This avoids CSP violations from inline styles while keeping the visual design consistent

  switch (variant) {
    case 'pricing':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-40 -left-20 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="animate-float-slower absolute -right-20 bottom-40 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        </div>
      )

    case 'features':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="animate-float-slow absolute right-1/4 -bottom-40 h-80 w-80 rounded-full bg-green-500/10 blur-3xl"></div>
        </div>
      )

    case 'final':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl"></div>
        </div>
      )

    case 'demo':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-600/5 blur-3xl"></div>
          <div className="animate-float-slower absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-600/5 blur-3xl"></div>
        </div>
      )

    case 'platform':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-600/15 to-blue-600/15 blur-3xl"></div>
          <div className="animate-float-slower absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-600/15 to-pink-600/15 blur-3xl"></div>
          <div className="animate-float absolute top-3/4 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-green-600/10 to-emerald-600/10 blur-3xl"></div>
        </div>
      )

    case 'platform-graph':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -top-20 right-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-blue-600/12 to-indigo-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-600/8 to-violet-600/8 blur-3xl"></div>
        </div>
      )

    case 'platform-console':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower absolute top-1/3 -left-40 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-green-600/10 to-emerald-600/10 blur-3xl"></div>
          <div className="animate-float absolute -right-40 bottom-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-600/12 to-teal-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute top-2/3 right-1/3 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-blue-600/8 to-sky-600/8 blur-3xl"></div>
        </div>
      )

    case 'platform-schema':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-600/10 to-amber-600/10 blur-3xl"></div>
          <div className="animate-float-slower absolute -bottom-20 left-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-red-600/8 to-rose-600/8 blur-3xl"></div>
          <div className="animate-float-slow absolute top-1/2 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-pink-600/12 to-fuchsia-600/12 blur-3xl"></div>
        </div>
      )

    case 'platform-business':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/12 to-blue-600/12 blur-3xl"></div>
          <div className="animate-float absolute top-2/3 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-violet-600/10 to-purple-600/10 blur-3xl"></div>
        </div>
      )

    case 'platform-investment':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower absolute -top-32 left-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-emerald-600/10 to-green-600/10 blur-3xl"></div>
          <div className="animate-float absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-600/12 to-cyan-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-lime-600/8 to-emerald-600/8 blur-3xl"></div>
        </div>
      )

    case 'hero':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-0 right-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 blur-3xl"></div>
          <div className="animate-float-slower absolute -bottom-40 -left-40 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-purple-600/15 to-pink-600/15 blur-3xl"></div>
          <div className="animate-float absolute top-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/10 to-violet-600/10 blur-3xl"></div>
        </div>
      )

    case 'product':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -top-32 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/12 to-cyan-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute right-1/3 bottom-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-green-600/10 to-teal-600/10 blur-3xl"></div>
        </div>
      )

    case 'sec-repository':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute -top-20 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-600/15 to-blue-600/15 blur-3xl"></div>
          <div className="animate-float-slower absolute -right-32 bottom-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-blue-600/12 to-indigo-600/12 blur-3xl"></div>
          <div className="animate-float absolute top-2/3 left-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-cyan-600/8 to-teal-600/8 blur-3xl"></div>
        </div>
      )

    case 'applications':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower absolute top-1/4 -right-32 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-violet-600/12 to-purple-600/12 blur-3xl"></div>
          <div className="animate-float absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/10 to-pink-600/10 blur-3xl"></div>
          <div className="animate-float-slow absolute top-1/2 left-1/4 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-600/8 to-blue-600/8 blur-3xl"></div>
        </div>
      )

    case 'integrations':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-0 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-600/10 to-orange-600/10 blur-3xl"></div>
          <div className="animate-float-slow absolute bottom-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-600/12 to-red-600/12 blur-3xl"></div>
          <div className="animate-float-slower absolute top-2/3 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-yellow-600/8 to-amber-600/8 blur-3xl"></div>
        </div>
      )

    case 'opensource':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute -top-20 right-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-teal-600/12 to-cyan-600/12 blur-3xl"></div>
          <div className="animate-float absolute bottom-0 left-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-sky-600/10 to-blue-600/10 blur-3xl"></div>
          <div className="animate-float-slower absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-600/8 to-green-600/8 blur-3xl"></div>
        </div>
      )

    case 'os-getting-started':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-1/4 -left-20 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-green-600/12 to-emerald-600/12 blur-3xl"></div>
          <div className="animate-float-slower absolute -right-32 bottom-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-600/10 to-cyan-600/10 blur-3xl"></div>
        </div>
      )

    case 'os-use-cases':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute -top-32 left-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/12 to-violet-600/12 blur-3xl"></div>
          <div className="animate-float absolute -right-20 bottom-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-fuchsia-600/10 to-pink-600/10 blur-3xl"></div>
          <div className="animate-float-slower absolute top-1/2 left-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-indigo-600/8 to-blue-600/8 blur-3xl"></div>
        </div>
      )

    case 'os-client-libs':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute top-0 right-1/4 h-[580px] w-[580px] rounded-full bg-gradient-to-br from-blue-600/12 to-sky-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute -bottom-20 left-1/4 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-cyan-600/10 to-teal-600/10 blur-3xl"></div>
        </div>
      )

    case 'os-aws':
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slower absolute top-1/3 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-600/10 to-amber-600/10 blur-3xl"></div>
          <div className="animate-float absolute -right-40 bottom-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-yellow-600/12 to-orange-600/12 blur-3xl"></div>
          <div className="animate-float-slow absolute top-0 left-1/2 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-red-600/8 to-rose-600/8 blur-3xl"></div>
        </div>
      )

    default:
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-20 left-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"></div>
          <div className="animate-float-slower absolute right-10 bottom-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="animate-float absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>
      )
  }
}
