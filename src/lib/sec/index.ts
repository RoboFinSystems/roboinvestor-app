/** SEC repository report viewer — session-authed data access + rendering shell. */
export {
  getEntityByCik,
  listReports,
  makeSecQuery,
  searchEntities,
  type SecEntity,
  type SecFiling,
} from './client'
export { FilingPicker } from './components/FilingPicker'
export { ReportScreen } from './components/ReportScreen'
export { SectionedReport } from './components/SectionedReport'
export { TickerSearch } from './components/TickerSearch'
