// design-sync entry barrel — RoboInvestor app-focused build.
//
// The package-shape synth entry only re-exports via `export *`, which skips
// default exports; every landing section is a default export. This barrel
// names each component so the converter discovers them (and fixes the
// EcosystemSection/OpenSourceSection function-name mismatch). Relative paths
// keep the barrel itself alias-free; the components' own `@/…` and `next/*`
// imports resolve through esbuild's tsconfig (cfg.tsconfig → app tsconfig).
//
// Scope: Phase 1 = the landing / brand surface only. App-distinctive views
// (portfolio, console, entity browser) and EntitySelectorDropdown are a later
// phase (they need provider/data mocking — see the exclusion note below).

export { default as AIAnalysisSection } from '../src/components/landing/AIAnalysisSection'
export { default as ContactForm } from '../src/components/landing/ContactForm'
export { default as ContactModal } from '../src/components/landing/ContactModal'
export { default as EcosystemSection } from '../src/components/landing/EcosystemSection'
export { default as FeaturesSection } from '../src/components/landing/FeaturesSection'
export { default as FinalCTA } from '../src/components/landing/FinalCTA'
export { default as FloatingElementsVariant } from '../src/components/landing/FloatingElementsVariant'
export { default as Footer } from '../src/components/landing/Footer'
export { default as Header } from '../src/components/landing/Header'
export { default as HeroSection } from '../src/components/landing/HeroSection'
export { default as InvestorSchemaSection } from '../src/components/landing/InvestorSchemaSection'
export { default as ResearchSection } from '../src/components/landing/ResearchSection'

// EntitySelectorDropdown is intentionally excluded: it reads GraphProvider /
// EntityProvider / SSO context and only renders a floor card here. It belongs to
// the deferred "app-distinctive views" phase (needs a provider wrapper to render).
