import { redirect } from 'next/navigation'

// The per-company filing viewer keyed by CIK moved to Company Research, which
// is keyed by ticker; the search there finds the company again in a keystroke.
export default function SecEntityReportsPage() {
  redirect('/companies')
}
