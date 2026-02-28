'use client'

import {
  customTheme,
  GraphFilters,
  onlyRepositories,
  PageLayout,
  useGraphContext,
} from '@/lib/core'
import { Button, Card } from 'flowbite-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { useMemo } from 'react'
import {
  HiChartPie,
  HiCog,
  HiHome,
  HiLightningBolt,
  HiPlus,
  HiTerminal,
  HiTrendingUp,
} from 'react-icons/hi'

const quickActions = [
  {
    title: 'Console',
    description: 'AI analysis terminal',
    icon: HiTerminal,
    href: '/console',
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'hover:shadow-emerald-500/10',
  },
  {
    title: 'Portfolio',
    description: 'View holdings',
    icon: HiChartPie,
    href: '/portfolio',
    gradient: 'from-teal-500 to-cyan-600',
    shadowColor: 'hover:shadow-teal-500/10',
  },
  {
    title: 'Settings',
    description: 'API & account',
    icon: HiCog,
    href: '/settings',
    gradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'hover:shadow-blue-500/10',
  },
]

const HomePageContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const router = useRouter()

  // Roboinvestor entity graphs (for full dashboard)
  const hasEntityGraph = useMemo(
    () => graphState.graphs.filter(GraphFilters.roboinvestor).length > 0,
    [graphState.graphs]
  )

  // Roboinvestor graphs OR shared repositories like SEC (for Console access)
  const hasAnyGraph = useMemo(
    () =>
      graphState.graphs.filter(GraphFilters.roboinvestor).length > 0 ||
      graphState.graphs.filter(onlyRepositories).length > 0,
    [graphState.graphs]
  )

  return (
    <PageLayout>
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
          <HiHome className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to RoboInvestor
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            AI-powered investment intelligence platform
          </p>
        </div>
      </div>

      {hasEntityGraph ? (
        <>
          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card
                  theme={customTheme.card}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${action.shadowColor}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-lg bg-gradient-to-br ${action.gradient} p-3`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Getting Started Card */}
            <Card theme={customTheme.card} className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <HiTrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Getting Started
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    1. Connect Your Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Import portfolio data or connect to external sources through
                    our integrations. Your data is stored securely in the
                    RoboSystems knowledge graph.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    2. Use the Console
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open the interactive Console to analyze your investments
                    using natural language. Ask questions like &quot;Show me my
                    top performing holdings&quot; or &quot;What&apos;s my sector
                    allocation?&quot;
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    3. Set Up MCP
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect Claude Desktop or Claude Code to your portfolio
                    using MCP (Model Context Protocol). Type /mcp in the Console
                    to generate your configuration.
                  </p>
                </div>
              </div>
            </Card>

            {/* Features Card */}
            <Card theme={customTheme.card}>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Platform Features
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      AI-Powered Analysis
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Claude integration for intelligent insights
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-teal-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Knowledge Graph
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Semantic portfolio relationships
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-cyan-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Interactive Console
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Natural language queries
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      MCP Protocol
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connect to Claude Desktop
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Open Source
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Apache 2.0 licensed, fully customizable
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                <a
                  href="https://github.com/RoboFinSystems/roboinvestor-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </Card>
          </div>

          {/* Alpha Notice */}
          <Card
            theme={customTheme.card}
            className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <HiLightningBolt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  Alpha Release
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  RoboInvestor is currently in alpha. This is the foundational
                  framework for building AI-powered investment applications.
                  Features are being actively developed and APIs may change.
                  Check our{' '}
                  <a
                    href="https://github.com/RoboFinSystems/roboinvestor-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    GitHub repository
                  </a>{' '}
                  for the latest updates.
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          {/* Console shortcut when user has shared repos but no entity graph */}
          {hasAnyGraph && (
            <Link href="/console">
              <Card
                theme={customTheme.card}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
                    <HiTerminal className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Open Console
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Query shared repositories using AI-powered natural
                      language
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Create graph CTA */}
          <Card
            theme={customTheme.card}
            className="transition-shadow hover:shadow-lg"
          >
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900">
                  <HiPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  Create Your First Graph
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A graph powers all of RoboInvestor&apos;s features. Create one
                to start managing your investment data.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Track your portfolio holdings and investment entities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Analyze investments using AI-powered natural language
                    queries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Connect Claude Desktop via MCP for deeper analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">&#10003;</span>
                  <span>
                    Store data in a semantic knowledge graph for rich
                    relationships
                  </span>
                </li>
              </ul>
              <Button
                theme={customTheme.button}
                color="primary"
                onClick={() => router.push('/graphs/new')}
                className="w-full"
                size="lg"
              >
                <HiPlus className="mr-2 h-5 w-5" />
                Create Graph
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}

export default HomePageContent
