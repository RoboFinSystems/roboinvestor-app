'use client'

import AIAnalysisSection from '@/components/landing/AIAnalysisSection'
import OpenSourceSection from '@/components/landing/EcosystemSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import InvestorSchemaSection from '@/components/landing/InvestorSchemaSection'

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />
        <InvestorSchemaSection />
        <AIAnalysisSection />
        <OpenSourceSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
