const withFlowbiteReact = require('flowbite-react/plugin/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withFlowbiteReact(nextConfig)
