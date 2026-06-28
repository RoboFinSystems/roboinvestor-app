import type { Metadata } from 'next'
import RegisterForm from './content'

export const metadata: Metadata = {
  title: 'Create Account | RoboInvestor',
  description:
    'Create a RoboInvestor account — AI-powered portfolio management, performance tracking, and investment insights.',
  alternates: { canonical: 'https://roboinvestor.ai/register' },
}

export default function RegisterPage() {
  return <RegisterForm />
}
