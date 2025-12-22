'use client'

import { customTheme } from '@/lib/core'
import { Card } from 'flowbite-react'
import Link from 'next/link'
import type { FC } from 'react'
import {
  HiChartPie,
  HiCurrencyDollar,
  HiLightningBolt,
  HiTerminal,
  HiTrendingUp,
} from 'react-icons/hi'

const HomePageContent: FC = function () {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="font-heading mb-2 text-3xl font-bold tracking-wide text-gray-900 dark:text-white">
          Welcome to RoboInvestor
        </h1>
        <p className="text-lg font-light text-gray-500 dark:text-gray-400">
          AI-powered investment intelligence platform
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  Console
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI analysis terminal
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/portfolio">
          <Card
            theme={customTheme.card}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 p-3">
                <HiChartPie className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Portfolio
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View holdings
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/chat">
          <Card
            theme={customTheme.card}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-3">
                <HiLightningBolt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI Chat
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask anything
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/settings">
          <Card
            theme={customTheme.card}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3">
                <HiCurrencyDollar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Settings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  API & account
                </p>
              </div>
            </div>
          </Card>
        </Link>
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
                Import portfolio data or connect to external sources through our
                integrations. Your data is stored securely in the RoboSystems
                knowledge graph.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                2. Use the Console
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open the interactive Console to analyze your investments using
                natural language. Ask questions like "Show me my top performing
                holdings" or "What's my sector allocation?"
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                3. Set Up MCP
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect Claude Desktop or Claude Code to your portfolio using
                MCP (Model Context Protocol). Type /mcp in the Console to
                generate your configuration.
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
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
            <svg
              className="h-5 w-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
              Alpha Release
            </h3>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              RoboInvestor is currently in alpha. This is the foundational
              framework for building AI-powered investment applications.
              Features are being actively developed and APIs may change. Check
              our{' '}
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
    </div>
  )
}

export default HomePageContent
