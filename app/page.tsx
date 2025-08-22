import { Header } from "@/components/header"
import { InnovativeHero } from "@/components/innovative-hero"
import { FeaturedCompanies } from "@/components/featured-companies"
import { UpcomingTours } from "@/components/upcoming-tours"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"

export default function HomePage() {
  return (
    <AuthGuard requireAuth={true}>
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
    </AuthGuard>
  )
}
