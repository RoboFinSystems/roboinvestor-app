import withFlowbiteReact from 'flowbite-react/plugin/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cap the `stale-while-revalidate` window CloudFront is handed on ISR pages.
  // Next derives it as `expireTime - revalidate`, so the default of one year gave
  // research pages `s-maxage=3600, stale-while-revalidate=31532400`: past the first
  // hour an edge answers with the *previous* render and only then refreshes in the
  // background. A browser gets the new copy on its second visit; Googlebot fetches a
  // page once and would index the render we replaced. Matching this to the research
  // pages' own `revalidate = 3600` drops the directive entirely (Next emits it only
  // while `revalidate < expireTime`), so an expired edge revalidates before it
  // answers, and a republished brief is live everywhere within the hour. /docs
  // (`revalidate = 300`) keeps a 3300s window, which lands on the same ceiling.
  expireTime: 3600,
  images: {
    // Research cards load card-sized webps straight from the content CDN
    // (CoverageCard). The optimizer is only the fallback for an item published
    // before those existed: it shrinks the 1920x1080 PNG (~2.5 MB) on the app
    // instance, which is CPU the 0.25 vCPU service cannot spare under a grid of
    // cards (measured 2026-09-16). Only that path is allowed; the optimizer
    // rejects every other remote host.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.robosystems.ai',
        pathname: '/content/**',
      },
    ],
  },
  experimental: {
    // Server Actions POST to the page route and Next.js rejects the request
    // ("Invalid Server Actions request") unless the browser `Origin` matches
    // the `Host`/`x-forwarded-host` it sees. In prod the app runs on App Runner
    // behind CloudFront, whose origin is the raw `*.awsapprunner.com` host — so
    // Next always sees that host, never `roboinvestor.ai`, and every action
    // (graph/entity/sidebar cookie persistence) 500s. Allow the public origin
    // explicitly so the CSRF origin check passes behind the CDN. www redirects
    // to the apex, so only the apex is listed.
    serverActions: {
      allowedOrigins: ['roboinvestor.ai'],
    },
  },
}

export default withFlowbiteReact(nextConfig)
