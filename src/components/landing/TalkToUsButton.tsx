'use client'

import { useState } from 'react'
import ContactModal from './ContactModal'

const BUTTON_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:border-gray-500 hover:bg-white/5 sm:px-8 sm:py-4 sm:text-lg'

// The conversation path beside Get started on the landing, and beside the research
// pages' doors. `className` restyles the trigger to sit in a link row or a top bar.
export default function TalkToUsButton({
  className = BUTTON_CLASS,
  label = 'Talk to us',
}: {
  className?: string
  label?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {label}
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
