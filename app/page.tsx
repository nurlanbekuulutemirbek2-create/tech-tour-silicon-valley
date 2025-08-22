import { InnovativeHero } from "@/components/innovative-hero"
import { FeaturedCompanies } from "@/components/featured-companies"
import { UpcomingTours } from "@/components/upcoming-tours"
import { ReviewsSection } from "@/components/reviews-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        <InnovativeHero />
        <FeaturedCompanies />
        <UpcomingTours />
        <AboutSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}
