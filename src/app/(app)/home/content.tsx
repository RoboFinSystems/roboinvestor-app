'use client'

import {
  customTheme,
  GraphFilters,
  onlyRepositories,
  PageHeader,
  PageLayout,
  useGraphContext,
} from '@/lib/core'
import { useSSO } from '@/lib/core/auth-core/sso'
import { Button, Card } from 'flowbite-react'
import Link from 'next/link'
import type { ComponentType, FC } from 'react'
import { useMemo } from 'react'
import {
  HiDocumentReport,
  HiDocumentText,
  HiGlobeAlt,
  HiHome,
  HiOfficeBuilding,
  HiPlus,
  HiSearch,
  HiTerminal,
  HiTrendingUp,
} from 'react-icons/hi'
import { TbTrendingUp } from 'react-icons/tb'

const API_URL =
  process.env.NEXT_PUBLIC_ROBOSYSTEMS_API_URL || 'http://localhost:8000'

interface ActionCard {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  href: string
  iconBg: string
  iconColor: string
}

// Shared tools available against any usable graph (entity graph or repository).
const TOOL_ACTIONS: ActionCard[] = [
  {
    title: 'Console',
    description: 'Ask questions in natural language',
    icon: HiTerminal,
    href: '/console',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Search',
    description: 'Search across the graph',
    icon: HiSearch,
    href: '/search',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
]

// Research is surfaced for the SEC/repository context (public-market analysis),
// not the user's own investment graph.
const RESEARCH_ACTION: ActionCard = {
  title: 'Research',
  description: 'AI research & market analysis',
  icon: HiDocumentText,
  href: '/research',
  iconBg: 'bg-rose-100 dark:bg-rose-900',
  iconColor: 'text-rose-600 dark:text-rose-400',
}

const actionCardClass =
  'flex items-center gap-4 rounded-lg border border-zinc-200 bg-white/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-zinc-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500'

const gettingStarted = [
  {
    step: '1',
    title: 'Pick a graph',
    body: 'Use the selector in the top bar to choose an investment graph or a shared repository like SEC — the app tailors itself to what you select.',
  },
  {
    step: '2',
    title: 'Explore with the Console',
    body: 'Ask questions in plain English — "What are my largest positions?" or query filings across 10,000+ public companies in the SEC repository.',
  },
  {
    step: '3',
    title: 'Connect Claude via MCP',
    body: 'Type /mcp in the Console to connect Claude Desktop or Claude Code to your graph for deeper, agent-driven analysis.',
  },
]

const HomePageContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const { navigateToApp } = useSSO(API_URL)

  // The currently selected graph drives which actions are surfaced.
  const currentGraph = useMemo(
    () =>
      graphState.graphs.find((g) => g.graphId === graphState.currentGraphId) ??
      null,
    [graphState.graphs, graphState.currentGraphId]
  )
  const isInvestorGraph =
    !!currentGraph && GraphFilters.roboinvestor(currentGraph)
  const isRepository = !!currentGraph && onlyRepositories(currentGraph)

  // Owning a roboinvestor graph anywhere decides dashboard vs. create-graph.
  const hasInvestorGraph = useMemo(
    () => graphState.graphs.filter(GraphFilters.roboinvestor).length > 0,
    [graphState.graphs]
  )
  const hasAnyGraph = useMemo(
    () =>
      hasInvestorGraph || graphState.graphs.filter(onlyRepositories).length > 0,
    [graphState.graphs, hasInvestorGraph]
  )

  // Shared repository that exposes the filing viewer (SEC), for the Reports
  // shortcut. Prefer the SEC repo; fall back to the first repository.
  const reportsRepoId = useMemo(() => {
    const repos = graphState.graphs.filter(onlyRepositories)
    return (repos.find((r) => r.graphId === 'sec') ?? repos[0])?.graphId ?? null
  }, [graphState.graphs])

  // Quick actions tailored to the currently selected graph. Entity-graph
  // features (Portfolio, Entity) only when an investor graph is active; the
  // filing viewer (Reports) only for the SEC repository; shared tools always.
  const quickActions = useMemo<ActionCard[]>(() => {
    const investor: ActionCard[] = [
      {
        title: 'Portfolio',
        description: 'Holdings, securities & positions',
        icon: TbTrendingUp,
        href: '/portfolio',
        iconBg: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      {
        title: 'Entity',
        description: 'Company profile & subsidiaries',
        icon: HiOfficeBuilding,
        href: '/entity',
        iconBg: 'bg-primary-100 dark:bg-primary-900',
        iconColor: 'text-primary-600 dark:text-primary-400',
      },
    ]
    const reports: ActionCard[] =
      isRepository && currentGraph?.graphId === 'sec'
        ? [
            {
              title: 'Reports',
              description: 'Filings & financial statements',
              icon: HiDocumentReport,
              href: `/repositories/${currentGraph.graphId}/reports`,
              iconBg: 'bg-amber-100 dark:bg-amber-900',
              iconColor: 'text-amber-600 dark:text-amber-400',
            },
          ]
        : []
    return [
      ...(isInvestorGraph ? investor : []),
      ...reports,
      ...TOOL_ACTIONS,
      // Research is public-market analysis — omit it on the user's own graph.
      ...(isInvestorGraph ? [] : [RESEARCH_ACTION]),
    ]
  }, [isInvestorGraph, isRepository, currentGraph])

  // Explore actions shown in the create-graph empty state. Research and
  // Repositories require no graph, so they always appear — and are the only
  // actions when nothing is available yet. Console/Reports are added only when
  // the user has a usable repository (e.g. SEC). This mirrors the sidebar,
  // which likewise shows only Research + Repositories when no graph is present.
  const exploreActions: ActionCard[] = [
    ...(hasAnyGraph
      ? [
          {
            title: 'Open Console',
            description: 'Query repositories with natural language',
            icon: HiTerminal,
            href: '/console',
            iconBg: 'bg-cyan-100 dark:bg-cyan-900',
            iconColor: 'text-cyan-600 dark:text-cyan-400',
          },
        ]
      : []),
    ...(reportsRepoId
      ? [
          {
            title: 'Reports',
            description: 'Browse SEC filings & financial statements',
            icon: HiDocumentReport,
            href: `/repositories/${reportsRepoId}/reports`,
            iconBg: 'bg-amber-100 dark:bg-amber-900',
            iconColor: 'text-amber-600 dark:text-amber-400',
          },
        ]
      : []),
    {
      title: 'Research',
      description: 'AI research & market analysis',
      icon: HiDocumentText,
      href: '/research',
      iconBg: 'bg-rose-100 dark:bg-rose-900',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Repositories',
      description: 'Browse shared data repositories',
      icon: HiGlobeAlt,
      href: '/repositories',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ]

  // Match the explore grid's column count to the number of cards so they always
  // stretch to fill the row (2 cards → 2 columns, 4 cards → 4 columns) rather
  // than leaving empty space at a fixed 3-column layout.
  const exploreGridCols =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[Math.min(exploreActions.length, 4)] ??
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <PageLayout>
      <PageHeader
        icon={HiHome}
        title={
          currentGraph
            ? `Welcome back to ${currentGraph.graphName}`
            : 'Welcome to RoboInvestor'
        }
        subtitle="AI-powered investment intelligence platform"
      />

      {hasInvestorGraph ? (
        <>
          {/* Quick actions — tailored to the selected graph */}
          <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={actionCardClass}
              >
                <div className={`rounded-lg ${action.iconBg} p-3`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Getting started */}
          <Card theme={customTheme.card}>
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary-500/20 rounded-lg p-2">
                <HiTrendingUp className="text-primary-500 h-5 w-5" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                Getting Started
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {gettingStarted.map((s) => (
                <div
                  key={s.step}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-primary-500/15 text-primary-600 dark:text-primary-400 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                      {s.step}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          {/* Create graph CTA — the primary action, shown first */}
          <Card
            theme={customTheme.card}
            className="transition-shadow hover:shadow-lg"
          >
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 dark:bg-primary-900 rounded-lg p-3">
                  <HiPlus className="text-primary-600 dark:text-primary-400 h-6 w-6" />
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
                onClick={() => navigateToApp('robosystems', '/graphs/new')}
                className="w-full"
                size="lg"
              >
                <HiPlus className="mr-2 h-5 w-5" />
                Create Graph
              </Button>
            </div>
          </Card>

          {/* What you can do without a graph (Research, Repositories), plus
              repository tools when a shared repository is available. */}
          <div className={`grid gap-4 ${exploreGridCols}`}>
            {exploreActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={actionCardClass}
              >
                <div className={`rounded-lg ${action.iconBg} p-3`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default HomePageContent
