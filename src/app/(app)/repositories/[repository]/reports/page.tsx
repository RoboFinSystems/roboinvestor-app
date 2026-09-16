import { redirect } from 'next/navigation'

// The SEC filing viewer moved off the graph and onto the public filing catalog:
// it is Company Research now, for every user, whatever graph is selected.
export default function SecReportsSearchPage() {
  redirect('/companies')
}
