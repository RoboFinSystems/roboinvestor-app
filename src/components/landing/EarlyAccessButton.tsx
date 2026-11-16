'use client'

import { useState } from 'react'
import ContactModal from './ContactModal'

// The body CTAs ask for a conversation, not a sign-up: RoboInvestor is early.
// The header's Register stays for SEC research users.
export default function EarlyAccessButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 relative overflow-hidden rounded-lg bg-linear-to-r px-6 py-3 text-base font-medium text-white shadow-2xl transition-all duration-300 sm:px-8 sm:py-4 sm:text-lg"
      >
        <span className="relative z-10">Talk to us about early access</span>
        <div className="absolute inset-0 -translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0"></div>
      </button>
      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Early access to RoboInvestor"
        description="Tell us about your fund and its portfolio companies. Joey replies personally."
        formType="early-access"
      />
    </>
  )
}
