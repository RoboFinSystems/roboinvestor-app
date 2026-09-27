import { LiveDemo } from '@robosystems/core/ui-components'
import FloatingElementsVariant from './FloatingElementsVariant'

// A PDF update keeps the numbers and loses everything behind them, and the fund retypes it
// into a tracker. A report shared from the company's ledger arrives as data the fund can ask
// about. The demo (public/demos/contrast.js) plays both sides.

export default function ContrastSection() {
  return (
    <section
      id="why"
      className="relative bg-linear-to-b from-zinc-900 to-black py-16 sm:py-24"
    >
      <FloatingElementsVariant variant="features" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="bg-primary-500/20 text-primary-400 mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            Off the PDF chain
          </div>
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Stop retyping investor updates
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            A PDF update is out of date before it reaches your tracker. When a
            portfolio company keeps its books on RoboLedger, it shares its
            reports straight into your fund, in the same taxonomy as every
            public filer, and your AI can answer questions about them.
          </p>
        </div>

        <LiveDemo
          name="contrast"
          aspect={1600 / 720}
          phoneAspect={720 / 1100}
          label="Last year's investor update is retyped by hand into a tracker while it ages, beside this year's report arriving in RoboInvestor as data and answering a question about monthly burn."
        />
      </div>
    </section>
  )
}
