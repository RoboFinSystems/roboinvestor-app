'use client'

import { customTheme } from '@/lib/core'
import { Card } from 'flowbite-react'
import Link from 'next/link'
import type { FC } from 'react'
import {
  HiChartPie,
  HiCurrencyDollar,
  HiLightningBolt,
  HiScale,
  HiTerminal,
  HiTrendingUp,
} from 'react-icons/hi'

const PortfolioPageContent: FC = function () {
  const plannedFeatures = [
    {
      icon: HiChartPie,
      title: 'Holdings Overview',
      description:
        'View all your holdings with current values, cost basis, and gain/loss metrics',
      color: 'emerald',
    },
    {
      icon: HiTrendingUp,
      title: 'Performance Charts',
      description:
        'Interactive charts showing portfolio performance over time with benchmarks',
      color: 'teal',
    },
    {
      icon: HiScale,
      title: 'Asset Allocation',
      description:
        'Visualize your portfolio allocation by sector, asset class, and geography',
      color: 'cyan',
    },
    {
      icon: HiCurrencyDollar,
      title: 'Dividend Tracking',
      description:
        'Monitor dividend income, yield, and reinvestment opportunities',
      color: 'blue',
    },
    {
      icon: HiLightningBolt,
      title: 'Risk Metrics',
      description:
        'Beta, volatility, Sharpe ratio, and other risk analysis tools',
      color: 'purple',
    },
  ]

  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-500',
    teal: 'bg-teal-500/20 text-teal-500',
    cyan: 'bg-cyan-500/20 text-cyan-500',
    blue: 'bg-blue-500/20 text-blue-500',
    purple: 'bg-purple-500/20 text-purple-500',
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 p-3">
            <HiChartPie className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Investment portfolio management
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card theme={customTheme.card} className="text-center">
        <div className="py-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <HiChartPie className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Dashboard Coming Soon
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
            We're building a comprehensive portfolio management interface. In
            the meantime, you can use the Console for AI-powered portfolio
            analysis.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/console"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-medium text-white transition-all hover:from-emerald-600 hover:to-teal-600"
            >
              <HiTerminal className="h-5 w-5" />
              Open Console
            </Link>
          </div>
        </div>
      </Card>

      {/* Planned Features */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Planned Features
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plannedFeatures.map((feature, idx) => (
            <Card key={idx} theme={customTheme.card}>
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-lg p-2 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Console Alternative */}
      <Card
        theme={customTheme.card}
        className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-emerald-500/20 p-2">
            <HiTerminal className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
              Use the Console Now
            </h3>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
              While we build the visual portfolio interface, you can already
              analyze your investments using the AI-powered Console. Try queries
              like:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
              <li>• "Show me my portfolio performance"</li>
              <li>• "What's my sector allocation?"</li>
              <li>• "Which holdings have the highest dividend yield?"</li>
              <li>• "Analyze my risk exposure"</li>
            </ul>
            <Link
              href="/console"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              Go to Console
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PortfolioPageContent
