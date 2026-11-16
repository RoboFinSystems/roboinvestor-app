import type { Metadata } from 'next'
import RegisterForm from './content'

export const metadata: Metadata = {
  title: 'Create Account | RoboInvestor',
  description:
    'Create a RoboInvestor account: private positions, shared portfolio reports, and public-company research.',
  // Registration is moving to the centralized login home; this page is (or
  // is becoming) a redirector, so keep it out of the index.
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return <RegisterForm />
}
