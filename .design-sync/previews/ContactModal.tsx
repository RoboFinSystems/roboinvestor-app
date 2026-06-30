import { ContactModal } from 'roboinvestor-app'

/** The contact modal in its open state — name, email, company, and message
 *  fields on a dark sheet, with the emerald submit action. */
export const Open = () => (
  <ContactModal
    isOpen
    onClose={() => {}}
    title="Contact Us"
    description="Send us a message and we'll get back to you as soon as possible."
    formType="general"
  />
)
