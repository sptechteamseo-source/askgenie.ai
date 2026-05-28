import Nav          from '@/components/layout/Nav'
import Footer       from '@/components/layout/Footer'
import Hero         from '@/components/sections/Hero'
import Logos        from '@/components/sections/Logos'
import Features     from '@/components/sections/Features'
import HowItWorks   from '@/components/sections/HowItWorks'
import Showcase     from '@/components/sections/Showcase'
import UseCases     from '@/components/sections/UseCases'
import Testimonials from '@/components/sections/Testimonials'
import Pricing      from '@/components/sections/Pricing'
import FAQ          from '@/components/sections/FAQ'
import CTA          from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <Showcase />
        <UseCases />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
