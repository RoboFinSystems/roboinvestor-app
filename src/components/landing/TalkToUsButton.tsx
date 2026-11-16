'use client'

import { useState } from 'react'
import ContactModal from './ContactModal'

// The secondary CTA beside Get started: a conversation about what a fund needs.
export default function TalkToUsButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:border-gray-500 hover:bg-white/5 sm:px-8 sm:py-4 sm:text-lg"
      >
        Talk to us
      </button>
      <ContactModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Talk to us about RoboInvestor"
        description="Tell us about your fund and its portfolio companies. Joey replies personally."
        formType="roboinvestor"
      />
    </>
  )
}
