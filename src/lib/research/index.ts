// The research catalog: data layer + types. Moved here from @robosystems/core/research
// on 2026-09-03, when roboinvestor.ai became the only site rendering research (the
// robosystems.ai pages now redirect here). The components live in
// src/components/research/.

export {
  CATALOG_URL,
  archivedVersion,
  fetchBrief,
  fetchCatalog,
  getAllCoverage,
  getCoverage,
  getCoverageTickers,
  versionSlug,
  youtubeId,
} from './catalog'
export { defaultPrompt, splitPrompt } from './prompt'
export * from './types'
