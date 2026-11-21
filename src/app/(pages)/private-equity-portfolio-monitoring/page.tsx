import FinalCTA from '@/components/landing/FinalCTA'
import TalkToUsButton from '@/components/landing/TalkToUsButton'
import {
  CardGrid,
  JsonLd,
  LINK_CLASS,
  OUTLINE_BUTTON_CLASS,
  PRIMARY_BUTTON_CLASS,
  Section,
} from '@/components/product-pages/parts'
import {
  getProductPage,
  productPageJsonLd,
  productPageMetadata,
} from '@/lib/product-pages'
import Link from 'next/link'

// Every claim here is checked against docs/product/roboinvestor (reports-from-a-file,
// reports-you-receive, your-portfolio, research-and-sec-filings) on the day it ships.
// Fund accounting, NAV and LP reporting are named only as what it does not do
// (vault: gtm/plan.md, "a fund: portfolio management, not fund accounting").

const page = getProductPage('/private-equity-portfolio-monitoring')

export const metadata = productPageMetadata(page)

const steps = [
  {
    title: 'Adds the company',
    body: 'Once, as an issuer in your graph, with a tax ID or an LEI if you have one so it is not added twice. A company you only follow works the same way.',
  },
  {
    title: 'Reads the statements out of the file',
    body: 'Value by value. Each number keeps the cell or the page it came from. A spreadsheet reads more reliably than a PDF, because every value has a cell.',
  },
  {
    title: 'Names each line',
    body: 'With a standard reporting concept, so a line means the same thing in every company’s report. The company’s own wording is kept.',
  },
  {
    title: 'Checks it before anything is saved',
    body: 'Every total has to equal the lines beneath it, and total assets have to equal liabilities and equity. A report that fails is refused, with the total, the period and the lines that were counted.',
  },
  {
    title: 'Saves it and reads it back',
    body: 'So you can compare it with the file. A corrected package is just loaded again: it replaces the report for that company, period and kind.',
  },
  {
    title: 'Tells you what it decided',
    body: 'The units where a header and the values disagree, and the lines a company arranges differently than the standard layout. A person reads that before relying on the report.',
  },
]

const doesNot = [
  'Fund accounting, NAV, capital accounts or LP reporting. The fund’s own ledger isn’t connected: positions linked to it are what we are building next.',
  'Budget and forecast columns. Actual results load; plans and variances don’t, yet.',
  'Valuations. A position’s current value is the mark you record; RoboInvestor does not price positions.',
  'An upload button or a portal for your companies. A file is loaded through your AI assistant, and the app shows the result.',
]

const asks = [
  'Load this board package for Halyard Robotics as their June quarterly report. Check it before you save it.',
  'Do a dry run first and tell me what doesn’t add up.',
  'How does Halyard Robotics’ gross margin this quarter compare with the last four?',
  'Which holdings aren’t linked to a company yet?',
]

export default function PrivateEquityPortfolioMonitoringPage() {
  return (
    <>
      <JsonLd data={productPageJsonLd(page)} />
      <article>
        <div className="relative">
          <div className="from-primary-900/20 via-secondary-900/20 to-accent-900/20 absolute inset-0 bg-linear-to-br"></div>
          <header className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-primary-400 mb-4 text-sm font-semibold tracking-wider uppercase">
              Portfolio monitoring
            </p>
            <h1 className="font-heading mb-6 text-4xl font-bold text-white md:text-5xl">
              {page.h1}
            </h1>
            <p className="mb-6 text-xl leading-relaxed text-gray-300">
              Your portfolio companies send a workbook or a PDF. Your AI
              assistant reads it into your RoboInvestor graph, names every line
              with a standard reporting concept, and checks every total before
              the report is saved. A company on RoboLedger shares its statements
              straight from its books. Either way, every company&apos;s report
              sits in one graph, read the same way, beside your holding in it.
            </p>
            <p className="text-base text-gray-400">
              Open source under Apache 2.0, on RoboSystems, the open-source
              knowledge graph for finance.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className={PRIMARY_BUTTON_CLASS}>
                Get started
              </Link>
              <TalkToUsButton className={OUTLINE_BUTTON_CLASS} />
              <Link href={page.docsPath} className={OUTLINE_BUTTON_CLASS}>
                Read the guide
              </Link>
            </div>
          </header>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Section title="Board packages in, checked statements out">
            <p>
              Most portfolio companies don&apos;t keep their books where you can
              read them. They send a balance sheet, a profit and loss statement,
              perhaps a cash flow statement. Give the file to your assistant
              with the company&apos;s name and anything the file doesn&apos;t
              say, such as whether figures are in thousands. Here is what it
              does with it.
            </p>
            <CardGrid items={steps} />
          </Section>

          <Section title="Companies on RoboLedger share their reports">
            <p>
              A company that keeps its books in RoboLedger adds your graph to a
              publish list and shares from the report. You receive the
              statements they chose to publish, with any notes attached, and
              never their transactions, customers or journal. If they withdraw
              the share, the report leaves your graph. A shared report is
              read-only: nothing is copied the other way.
            </p>
            <p>
              <Link href="/docs/reports-you-receive" className={LINK_CLASS}>
                Reports shared with you →
              </Link>
            </p>
          </Section>

          <Section title="The whole portfolio in one graph">
            <p>
              <strong className="text-white">Portfolio Reports</strong> lists
              every report you have received, marked as shared from the
              company&apos;s graph or loaded from a file. Open one to read its
              statements.
            </p>
            <p>
              <strong className="text-white">Portfolio</strong> holds what you
              own in each company: common, preferred, SAFEs, convertible notes,
              LLC units and the rest, grouped by issuer with cost basis and the
              current value you record. A partial total says so, such as{' '}
              <em>(2 of 3 marked)</em>, so it is never read as the whole
              holding.
            </p>
            <p>
              Because every line carries the same reporting concept, your
              assistant reads one company&apos;s quarters against each other,
              and one company against another, from Claude, ChatGPT or any MCP
              client. Reading and updating the graph through your own assistant
              uses no credits.
            </p>
            <p>
              <Link href="/docs/your-portfolio" className={LINK_CLASS}>
                Track private-company holdings →
              </Link>
            </p>
          </Section>

          <Section title="What a person still checks">
            <p>
              If a company&apos;s own totals don&apos;t add up, your assistant
              stops and tells you which one rather than change a number. Nothing
              ties the cash flow statement to the balance sheet automatically,
              so ask your assistant to confirm that opening cash plus the change
              in cash equals closing cash. The AI drafts. Your people approve.
            </p>
          </Section>

          <Section title="Public companies, from their SEC filings">
            <p>
              The structured filings of 8,000+ public companies live in a shared
              repository on RoboSystems, a subscription of its own that starts
              with a 14-day trial, card-free. Add it to your assistant as a
              second connection and keep the filings beside your portfolio. The
              research briefs we write from those filings are public.
            </p>
            <p>
              <Link href="/research" className={LINK_CLASS}>
                Equity research from the filings →
              </Link>
            </p>
          </Section>

          <Section title="What it doesn't do yet">
            <ul className="list-disc space-y-2 pl-6">
              {doesNot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Try asking">
            <ul className="list-disc space-y-2 pl-6">
              {asks.map((ask) => (
                <li key={ask}>&ldquo;{ask}&rdquo;</li>
              ))}
            </ul>
            <p>
              <Link href={page.docsPath} className={LINK_CLASS}>
                Load a report from a PDF or a spreadsheet, step by step →
              </Link>
            </p>
          </Section>
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
