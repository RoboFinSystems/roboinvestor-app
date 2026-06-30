# Building with the RoboInvestor design system

This is **RoboInvestor's own landing / brand surface** — the emerald-branded
marketing sections of the RoboInvestor app (an AI-powered investment-research and
portfolio product built on the RoboSystems knowledge-graph platform). It is built
on **Flowbite React** + **Tailwind CSS v4**. Components are exported from
`window.RoboinvestorApp.*`.

> This is distinct from `@robosystems/core` (the shared component library — buttons,
> modals, forms, layout). Those live in the RoboSystems design system. Here you'll
> find the composed, full-bleed **page sections** unique to RoboInvestor.

## Setup & wrapping

No provider wrapper is needed — these are presentational marketing sections that
render standalone. **Styling is global CSS**: the bundle ships `styles.css` (brand
tokens, fonts, compiled Tailwind utilities) — load it once and every component and
utility class below is available. The surface is **dark by default** (sections paint
their own near-black backgrounds). The brand fonts **Space Grotesk** (body/UI) and
**Orbitron** (display headings) are bundled and applied automatically.

Most sections take **no props** — drop them in and they fill the width:

```jsx
const { HeroSection, FeaturesSection, ResearchSection, FinalCTA, Footer } =
  window.RoboinvestorApp

function Landing() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ResearchSection />
      <FinalCTA />
      <Footer />
    </>
  )
}
```

`ContactModal` is the exception (it takes `isOpen` / `onClose` / `title` /
`description`), and `FloatingElementsVariant` takes a `variant` — see its preview.

## The components

| Group `landing`           | What it is                                                       |
| ------------------------- | ---------------------------------------------------------------- |
| `HeroSection`             | Full hero — gradient headline, value prop, three feature tiles   |
| `Header`                  | Fixed top nav — logo/wordmark, section links, sign-in/up actions |
| `Footer`                  | Site footer — product / applications columns, social, legal      |
| `FeaturesSection`         | "Open Source Investment Platform" — framework + capability grid  |
| `EcosystemSection`        | "Open Source & Self-Hosted" — local-dev + why-open-source        |
| `ResearchSection`         | "Equity Research, Generated From the Filings" — SEC-repo pitch   |
| `AIAnalysisSection`       | "AI-Powered Investment Insights" — question→insight walkthrough  |
| `InvestorSchemaSection`   | "Powered by RoboSystems" — knowledge-graph schema diagram        |
| `FinalCTA`                | Closing call-to-action band                                      |
| `ContactForm`             | Name / email / company / message form with emerald submit        |
| `ContactModal`            | The contact form in a modal (`isOpen`, `onClose`, …)             |
| `FloatingElementsVariant` | Ambient brand-motion blobs (`variant`) layered behind sections   |

## Styling idiom — Tailwind utilities, brand palette

Style with **Tailwind v4 utility classes** (no CSS-module names to import). The brand
color families each carry the full `50…950` scale:

| Family        | Role                                         | Example                                  |
| ------------- | -------------------------------------------- | ---------------------------------------- |
| `primary-*`   | brand **emerald** — primary actions, accents | `bg-primary-600`, `hover:bg-primary-700` |
| `secondary-*` | teal — secondary accents, gradients          | `from-secondary-400`                     |
| `accent-*`    | cyan — tertiary accents, gradients           | `text-accent-400`                        |
| `gray-*`      | neutral text/surfaces/borders                | `text-gray-300`, `border-gray-800`       |
| `amber-*`     | warm/warning accent                          | `bg-amber-500`                           |

Type: `font-sans` (Space Grotesk) for UI/body; `font-heading` (Orbitron) for display
headings. The canonical primary button:
`className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"`.

Sections are dark, full-bleed, and lean on layered gradients
(`bg-linear-to-br from-primary-900/20 …`) plus the floating-blob motion system.

## Where the truth lives

- `styles.css` (and the `_ds_bundle.css` it imports) — the actual tokens and compiled
  utilities. Read it before inventing class names.
- Per component: `<Name>.d.ts` (props) and `<Name>.prompt.md` (usage), plus the
  preview card for a worked example.

Icons are [`react-icons`](https://react-icons.github.io/react-icons/) (`react-icons/hi`).
