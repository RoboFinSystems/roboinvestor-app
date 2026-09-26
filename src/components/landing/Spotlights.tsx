import FloatingElementsVariant from './FloatingElementsVariant'
import LiveDemo from './LiveDemo'
import ProductShot from './ProductShot'

export interface Spotlight {
  id: string
  label: string
  title: string
  description: string
  bullets: string[]
  caption: string
  /** Animated demo module under /public/demos. */
  demo: string
  /** What the demo shows, for screen readers. */
  demoLabel: string
}

interface SpotlightsProps {
  id: string
  eyebrow: string
  heading: string
  intro: string
  spotlights: Spotlight[]
}

/** A group of product spotlights, each a short copy block beside its animated demo. */
export default function Spotlights({
  id,
  eyebrow,
  heading,
  intro,
  spotlights,
}: SpotlightsProps) {
  return (
    <section id={id} className="relative bg-black py-16 sm:py-24">
      <FloatingElementsVariant variant="features" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="bg-primary-500/20 text-primary-400 mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            {eyebrow}
          </div>
          <h2 className="font-heading mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
            {intro}
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {spotlights.map((s, idx) => (
            <div
              key={s.id}
              id={s.id}
              className={`grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                idx % 2 === 1 ? 'lg:[&>figure]:order-first' : ''
              }`}
            >
              <div className="min-w-0">
                <div className="bg-secondary-500/15 text-secondary-300 mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  {s.label}
                </div>
                <h3 className="font-heading mb-4 text-2xl font-bold text-white sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mb-6 text-base leading-relaxed text-gray-300">
                  {s.description}
                </p>
                <ul className="space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <svg
                        className="text-primary-400 mt-0.5 h-5 w-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-300">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ProductShot
                alt={`RoboInvestor — ${s.title}`}
                caption={s.caption}
              >
                <LiveDemo
                  name={s.demo}
                  aspect={1200 / 750}
                  phoneAspect={720 / 740}
                  label={s.demoLabel}
                />
              </ProductShot>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
