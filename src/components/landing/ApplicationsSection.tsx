'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ContactModal from './ContactModal'
import FloatingElementsVariant from './FloatingElementsVariant'

export default function ApplicationsSection() {
  const [showContact, setShowContact] = useState(false)

  return (
    <section
      id="applications"
      className="relative bg-linear-to-b from-black to-zinc-900 py-16 sm:py-24"
    >
      <FloatingElementsVariant variant="applications" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Applications Powered by RoboSystems
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            Purpose-built applications that leverage the RoboSystems Knowledge
            Graph to deliver intelligent financial and investment management
            capabilities.
          </p>
        </div>

        {/* Application Architecture Diagram */}
        <div className="mx-auto mb-16 max-w-4xl">
          <div className="rounded-2xl border border-gray-800 bg-linear-to-br from-zinc-900/50 to-zinc-800/20 p-4 hover:border-cyan-500/30 hover:bg-zinc-900/20 sm:p-6 md:p-8">
            <h3 className="font-heading mb-4 text-center text-lg font-semibold text-white sm:mb-6 sm:text-xl">
              How It Works
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-center overflow-x-auto">
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm text-white sm:px-4 sm:py-2 sm:text-base">
                        RoboLedger
                      </div>
                      <div className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white sm:px-4 sm:py-2 sm:text-base">
                        RoboInvestor
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-gray-400 sm:hidden">↕</div>
                      <div className="hidden text-gray-400 sm:block">↔</div>
                    </div>
                    <div className="rounded-lg bg-blue-600 px-4 py-4 text-sm text-white sm:px-6 sm:py-8 sm:text-base">
                      RoboSystems
                      <br className="sm:hidden" /> API
                    </div>
                    <div className="text-gray-400">
                      <span className="sm:hidden">↕</span>
                      <span className="hidden sm:inline">↔</span>
                    </div>
                    <div className="rounded-lg bg-purple-600 px-4 py-4 text-sm text-white sm:px-6 sm:py-8 sm:text-base">
                      Knowledge
                      <br className="sm:hidden" /> Graph
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-gray-400">
                RoboLedger syncs QuickBooks data into the RoboLedger schema for
                AI-powered financial reporting. RoboInvestor provides access to
                the SEC Shared Repository for securities research. Both leverage
                MCP and Claude AI for natural language queries against the
                knowledge graph.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          {/* RoboLedger */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-linear-to-br from-cyan-900/20 to-blue-900/20 hover:bg-cyan-900/20">
            <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
              <Link
                href="https://roboledger.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center gap-4 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/images/logos/roboledger.png"
                    alt="RoboLedger Logo"
                    width={64}
                    height={64}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
                    RoboLedger
                  </h3>
                  <p className="text-gray-400">AI-Native Financial Reporting</p>
                </div>
              </Link>

              <p className="mb-6 text-gray-300">
                Synchronize your QuickBooks accounting data into a unified
                knowledge graph for AI-powered reporting and analysis.
              </p>

              <div className="mb-8 space-y-4">
                <div>
                  <h4 className="mb-3 font-semibold text-cyan-300">
                    QuickBooks Integration
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>
                        OAuth2 secure connection to sync accounting data
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>
                        Chart of accounts, journal entries, and transactions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>Trial balance import for unified reporting</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-cyan-300">
                    AI-Native Reporting
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>
                        Natural language queries via MCP and Claude AI
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>
                        AI generates financial reports from plain English
                        requests
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-cyan-400">•</span>
                      <span>
                        XBRL-native reports that are queryable and comparable
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RoboInvestor */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-green-500/30 bg-linear-to-br from-green-900/20 to-blue-900/20 hover:bg-green-900/20">
            <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
              <Link
                href="https://roboinvestor.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center gap-4 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  <Image
                    src="/images/logos/roboinvestor.png"
                    alt="RoboInvestor Logo"
                    width={64}
                    height={64}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
                    RoboInvestor
                  </h3>
                  <p className="text-gray-400">
                    Securities Research & Investment Analytics
                  </p>
                </div>
              </Link>

              <p className="mb-6 text-gray-300">
                Access the SEC Shared Repository through AI-powered natural
                language queries for securities research and competitive
                analysis.
              </p>

              <div className="mb-8 space-y-4">
                <div>
                  <h4 className="mb-3 font-semibold text-green-300">
                    SEC Shared Repository
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>
                        100,000+ SEC XBRL filings across 4,000+ public companies
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>
                        10-K and 10-Q financial statements and fundamentals
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>Peer comparison and industry analysis</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-green-300">
                    AI-Powered Research
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>
                        Natural language queries via MCP and Claude AI
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>
                        AI-generated Cypher queries for complex analysis
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400">•</span>
                      <span>
                        Chat-based research interface with query history
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Apps Work with RoboSystems */}
        <div className="mt-12 rounded-2xl bg-linear-to-r from-zinc-800 to-zinc-900 p-4 sm:mt-16 sm:p-6 md:p-8">
          <h3 className="font-heading mb-4 text-center text-xl font-semibold text-white sm:mb-6 sm:text-2xl">
            Build on the RoboSystems Platform
          </h3>
          {/* SDK Section */}
          <div className="mb-16">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {/* MCP Client */}
              <div className="rounded-lg border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-800/20 p-4 hover:bg-gray-900/20 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                    <span className="text-xl font-bold text-white">AI</span>
                  </div>
                  <h4 className="font-semibold text-white">MCP Client</h4>
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  Claude integration via Model Context Protocol for AI agents
                </p>
                <code className="block rounded-sm bg-zinc-800 p-2 text-xs text-gray-300">
                  npx -y @robosystems/mcp
                </code>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="https://www.npmjs.com/package/@robosystems/mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    npm →
                  </Link>
                  <Link
                    href="https://github.com/RoboFinSystems/robosystems-mcp-client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    GitHub →
                  </Link>
                </div>
              </div>
              {/* Typescript Client */}
              <div className="rounded-lg border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-800/20 p-4 hover:bg-gray-900/20 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-xl font-bold text-white">TS</span>
                  </div>
                  <h4 className="font-semibold text-white">
                    TypeScript Client
                  </h4>
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  Full-featured Client for JavaScript and TypeScript
                  applications
                </p>
                <code className="block rounded-sm bg-zinc-800 p-2 text-xs text-gray-300">
                  npm install @robosystems/client
                </code>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="https://www.npmjs.com/package/@robosystems/client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    npm →
                  </Link>
                  <Link
                    href="https://github.com/RoboFinSystems/robosystems-typescript-client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    GitHub →
                  </Link>
                </div>
              </div>

              {/* Python Client */}
              <div className="rounded-lg border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-800/20 p-4 hover:bg-gray-900/20 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <span className="text-xl font-bold text-white">PY</span>
                  </div>
                  <h4 className="font-semibold text-white">Python Client</h4>
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  Python Client for backend applications and data science use
                  cases
                </p>
                <code className="block rounded-sm bg-zinc-800 p-2 text-xs text-gray-300">
                  pip install robosystems-client
                </code>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="https://pypi.org/project/robosystems-client/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    PyPI →
                  </Link>
                  <Link
                    href="https://github.com/RoboFinSystems/robosystems-python-client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    GitHub →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 text-gray-300">
            <p className="text-center">
              RoboLedger and RoboInvestor demonstrate the power of building
              specialized applications on top of the RoboSystems Knowledge
              Graph.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg p-3 text-center sm:p-4">
                <div className="mb-2 flex justify-center">
                  <svg
                    className="h-8 w-8 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 font-semibold text-white">
                  Specialized Schemas
                </h4>
                <p className="text-sm">
                  RoboLedger for accounting data, SEC XBRL for securities
                  research
                </p>
              </div>
              <div className="rounded-lg p-3 text-center sm:p-4">
                <div className="mb-2 flex justify-center">
                  <svg
                    className="h-8 w-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 font-semibold text-white">
                  Data Integration
                </h4>
                <p className="text-sm">
                  QuickBooks sync, SEC filings, and shared repository access
                </p>
              </div>
              <div className="rounded-lg p-3 text-center sm:p-4">
                <div className="mb-2 flex justify-center">
                  <svg
                    className="h-8 w-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="mb-1 font-semibold text-white">
                  MCP Agent Access
                </h4>
                <p className="text-sm">
                  Natural language queries via Claude AI and the MCP protocol
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-gray-400">
              Want to build your own application on RoboSystems?
              <button
                onClick={() => setShowContact(true)}
                className="ml-1 text-cyan-400 hover:underline"
              >
                Contact our developer team
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />
    </section>
  )
}
