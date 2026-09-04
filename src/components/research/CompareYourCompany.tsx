import Link from 'next/link'

/**
 * The door out of a research page and into the product.
 *
 * The searcher who lands on `/research/<ticker>` is usually a private-company operator
 * or analyst looking up a comparable, so the close is "compare your company to this
 * one", not "buy the SEC feed". The primary link goes to RoboLedger because the next
 * screen is connect-QuickBooks; the secondary keeps the SEC subscription as a second
 * choice rather than the only one.
 *
 * Copy discipline (gtm/plan.md §1.1): the comparison is a multi-connector session, so
 * "add the SEC graph beside your books" — never "one connector". No price appears here;
 * pricing lives behind the link.
 *
 * Deliberately silent on writes to QuickBooks. §1.1's rule governs how to say it when
 * it is said ("nothing writes back until you post an entry", never "read-only mode"),
 * not where. A reader who has not yet been asked to connect anything has no write
 * objection to answer, and raising one here manufactures the fear in the sentence that
 * is asking for the click. That reassurance belongs on the connect screen.
 *
 * Server-rendered from the same catalog item as the page, so it inherits the page's
 * ISR window and never needs a redeploy per report.
 */

const CONNECT_HREF = 'https://roboledger.ai/register'
const FILINGS_HREF = 'https://robosystems.ai/pricing'

export function CompareYourCompany({
  company,
  ticker,
}: {
  company: string
  ticker: string
}) {
  return (
    <section className="mx-auto mt-12 max-w-3xl rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Compare your company to {company}
      </h2>
      <p className="mt-3 text-gray-600 dark:text-gray-300">
        Connect your QuickBooks, add the SEC graph beside your books, and ask
        Claude how your margins and growth compare to {ticker} — every figure
        traced to a filing, the same as this report.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={CONNECT_HREF}
          className="from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-lg bg-linear-to-r px-4 py-2 text-sm font-medium text-white shadow-lg transition-all"
        >
          Connect your books
        </Link>
        <Link
          href={FILINGS_HREF}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Or query the filings yourself
        </Link>
      </div>
    </section>
  )
}

/**
 * The same door, one line, for the catalog page — where there is no single company to
 * name. Same two destinations so the index carries the door too.
 */
export function CompareYourCompanyLine() {
  return (
    <p className="mx-auto mt-6 max-w-2xl text-center text-gray-400">
      Connect your QuickBooks and compare your own numbers to any company
      covered here.{' '}
      <Link
        href={CONNECT_HREF}
        className="text-primary-400 font-medium hover:underline"
      >
        Connect your books
      </Link>{' '}
      or{' '}
      <Link href={FILINGS_HREF} className="font-medium hover:underline">
        query the filings yourself
      </Link>
      .
    </p>
  )
}
