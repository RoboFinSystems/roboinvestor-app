import { Header } from 'roboinvestor-app'

/** Landing top bar — RoboInvestor logo + wordmark, section nav, and the
 *  sign-in / sign-up actions. The header is `fixed`, so it pins to the top of
 *  the card; the black backdrop stands in for the dark hero it sits over. */
export const Default = () => (
  <div className="relative min-h-[180px] w-full bg-black">
    <Header />
  </div>
)
