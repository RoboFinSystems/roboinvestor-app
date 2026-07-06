import withFlowbiteReact from 'flowbite-react/plugin/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Server Actions POST to the page route and Next.js rejects the request
    // ("Invalid Server Actions request") unless the browser `Origin` matches
    // the `Host`/`x-forwarded-host` it sees. In prod the app runs on App Runner
    // behind CloudFront, whose origin is the raw `*.awsapprunner.com` host — so
    // Next always sees that host, never `roboinvestor.ai`, and every action
    // (graph/entity/sidebar cookie persistence) 500s. Allow the public origins
    // explicitly so the CSRF origin check passes behind the CDN.
    serverActions: {
      allowedOrigins: ['roboinvestor.ai', 'www.roboinvestor.ai'],
    },
  },
}

export default withFlowbiteReact(nextConfig)
