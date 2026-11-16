import Footer from '@/components/landing/Footer'

// The research pages are the site's largest search asset, so they carry the landing
// footer: the RoboSystems line, the product links and the contact form.
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
      <Footer />
    </div>
  )
}
