import withFlowbiteReact from 'flowbite-react/plugin/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Research coverage thumbnails are 1920x1080 PNGs (~2.5 MB each) on the
    // content CDN; next/image resizes them per card and serves webp.
    // Only that path is allowed — the optimizer rejects every other remote
    // host. CloudFront caches `/_next/image*` on the optimizer's own max-age
    // (see cloudformation/template.yaml), so App Runner isn't hit per view.
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
