'use client'

/**
 * Ask about this filing — the RoboSystems operator over the SEC graph,
 * anchored on the company and filing on screen. No key: the call is the
 * account's own, through the SDK, and it spends the account's credits, so the
 * card shows for a user whose graphs include the SEC repository and turns
 * into a pointer to Repositories for everyone else. The page underneath is
 * free either way.
 */
import {
  anchoredMessage,
  exampleQuestions,
  filingFocus,
} from '@/lib/filings/chat'
import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import { onlyRepositories, useGraphContext } from '@robosystems/core'
import { Spinner } from 'flowbite-react'
import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { HiChevronDown, HiChevronRight, HiSparkles } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Turn {
  role: 'user' | 'assistant'
  text: string
  error?: boolean
  credits?: number | null
}

const SEC_GRAPH_ID = 'sec'

const MARKDOWN_CLASS =
  'text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 [&_a]:text-primary-600 dark:[&_a]:text-primary-400 [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 dark:[&_code]:bg-zinc-800 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_table]:my-2 [&_table]:text-xs [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5'

export function FilingChat({
  company,
  filing,
}: {
  company: CompanyCatalog
  filing: CatalogFiling
}) {
  const { state } = useGraphContext()
  const hasSec = useMemo(
    () =>
      state.graphs.some(
        (g) => onlyRepositories(g) && g.graphId === SEC_GRAPH_ID
      ),
    [state.graphs]
  )

  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim()
      if (!q || busy) return
      setTurns((prev) => [...prev, { role: 'user', text: q }])
      setBusy(true)
      setProgress('Thinking')
      try {
        const { clients } = await import('@robosystems/client/clients')
        // Prior turns as the operator saw them: the questions without the
        // anchor (it rides on every current message) and the answers.
        const history = turns.map((t) => ({ role: t.role, content: t.text }))
        const result = await clients.operator.executeQuery(
          SEC_GRAPH_ID,
          {
            message: anchoredMessage(company, filing, q),
            // `standard` gives the operator loop enough tool turns for a
            // schema read, a query or two, and an answer.
            mode: 'standard',
            ...(history.length > 0 ? { history } : {}),
            context: { focus: filingFocus(company, filing) },
          },
          {
            mode: 'auto',
            onProgress: (message, percentage) =>
              setProgress(
                percentage !== undefined
                  ? `${message} (${percentage}%)`
                  : message
              ),
          }
        )
        // The API reports operator failures (credit pre-flight, timeouts) as
        // a normal response with `error_details` set; render those as errors.
        const details = result.error_details
        if (details) {
          const detail = [details.message, details.error, details.detail].find(
            (v): v is string => typeof v === 'string' && v.length > 0
          )
          setTurns((prev) => [
            ...prev,
            {
              role: 'assistant',
              text:
                detail ||
                result.content ||
                'The operator could not complete this request.',
              error: true,
            },
          ])
          return
        }
        const credits = (result.metadata ?? {})['credits_consumed'] as
          number | undefined
        setTurns((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: result.content || '(no answer returned)',
            credits: typeof credits === 'number' ? credits : null,
          },
        ])
      } catch (e) {
        setTurns((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
            error: true,
          },
        ])
      } finally {
        setBusy(false)
        setProgress('')
        requestAnimationFrame(() => {
          const el = scrollRef.current
          if (el) el.scrollTop = el.scrollHeight
        })
      }
    },
    [busy, turns, company, filing]
  )

  const header = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="flex w-full items-center gap-2 px-4 py-3 text-left"
    >
      {open ? (
        <HiChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
      ) : (
        <HiChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
      )}
      <HiSparkles className="text-primary-500 h-4 w-4 shrink-0" />
      <span className="font-semibold text-zinc-900 dark:text-white">
        Ask about this filing
      </span>
      <span className="ml-auto hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
        {hasSec
          ? 'Answers from the SEC graph. Uses credits.'
          : 'Needs the SEC repository'}
      </span>
    </button>
  )

  return (
    <section className="mb-8 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
      {header}
      {open && !hasSec ? (
        <div className="border-t border-zinc-200 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Questions about a filing run through the RoboSystems operator on the
          SEC knowledge graph and use your credits. Connect the SEC repository
          under{' '}
          <Link
            href="/repositories"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Repositories
          </Link>{' '}
          to ask here.
        </div>
      ) : null}
      {open && hasSec ? (
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          <div
            ref={scrollRef}
            className="max-h-[28rem] space-y-3 overflow-y-auto px-4 py-4"
          >
            {turns.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  Ask anything about {company.name}&apos;s {filing.form}. The
                  operator reads the SEC graph — this filing, prior periods, and
                  peers — and answers from the numbers.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {exampleQuestions(company, filing).map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={busy}
                      onClick={() => void ask(q)}
                      className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              turns.map((turn, i) =>
                turn.role === 'user' ? (
                  <div
                    key={i}
                    className="ml-auto max-w-[85%] rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    {turn.text}
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`max-w-[95%] rounded-lg px-3 py-2 ${
                      turn.error
                        ? 'border border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-zinc-50 dark:bg-zinc-950/40'
                    }`}
                  >
                    {turn.error ? (
                      turn.text
                    ) : (
                      <div className={MARKDOWN_CLASS}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {turn.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    {typeof turn.credits === 'number' ? (
                      <div className="mt-1 text-xs text-zinc-400">
                        {turn.credits.toFixed(1)} credits
                      </div>
                    ) : null}
                  </div>
                )
              )
            )}
            {busy ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Spinner size="sm" /> {progress || 'Thinking'}…
              </div>
            ) : null}
          </div>
          <form
            className="flex gap-2 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800"
            onSubmit={(e) => {
              e.preventDefault()
              const q = draft
              setDraft('')
              void ask(q)
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Ask about ${company.ticker}'s ${filing.form}…`}
              disabled={busy}
              aria-label="Ask about this filing"
              className="focus:border-primary-500 focus:ring-primary-500 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </div>
      ) : null}
    </section>
  )
}
