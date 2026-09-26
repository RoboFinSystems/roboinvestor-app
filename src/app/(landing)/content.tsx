'use client'

import ContrastSection from '@/components/landing/ContrastSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import InvestorSchemaSection from '@/components/landing/InvestorSchemaSection'
import ResearchSection from '@/components/landing/ResearchSection'
import Spotlights from '@/components/landing/Spotlights'
import {
  fundSpotlights,
  researchSpotlights,
} from '@/components/landing/spotlightContent'

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main>
        <HeroSection />
        <ContrastSection />
        <Spotlights
          id="features"
          eyebrow="Inside your fund"
          heading="Your positions and your companies' books, in one graph"
          intro="Track what the fund holds and read what its companies share, then ask about both from the AI chat you already use."
          spotlights={fundSpotlights}
        />
        <Spotlights
          id="public-companies"
          eyebrow="Public-company research"
          heading="Research any public company"
          intro="Every listed filer's statements, a console that answers in plain English, and search across the filings. No fund required."
          spotlights={researchSpotlights}
        />
        <InvestorSchemaSection />
        <ResearchSection />
        <FeaturesSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
