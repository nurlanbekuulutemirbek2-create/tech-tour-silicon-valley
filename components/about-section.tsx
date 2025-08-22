import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, MapPin, Clock } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About Tech Tour
          </Badge>
          <h2 className="font-serif text-4xl font-bold mb-6">Your Gateway to Silicon Valley Innovation</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're passionate about connecting curious minds with the world's most innovative companies. Since 2020,
            we've been providing exclusive behind-the-scenes access to Silicon Valley's tech giants.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2,500+ Visitors</h3>
              <p className="text-sm text-muted-foreground">
                Tech enthusiasts, students, and professionals have joined our tours
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">5-Star Rated</h3>
              <p className="text-sm text-muted-foreground">
                Consistently rated as the best tech tour experience in the Bay Area
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">15+ Companies</h3>
              <p className="text-sm text-muted-foreground">
                Exclusive partnerships with top tech companies across Silicon Valley
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4+ Years</h3>
              <p className="text-sm text-muted-foreground">
                Trusted experience in organizing premium tech company visits
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-muted-foreground mb-6">
                We believe that innovation thrives when curious minds connect with groundbreaking companies. Our mission
                is to bridge the gap between aspiring technologists and the companies shaping our future.
              </p>
              <p className="text-muted-foreground mb-8">
                Every tour is carefully curated to provide authentic insights into company culture, cutting-edge
                technologies, and the brilliant minds behind world-changing products.
              </p>
              <Button size="lg">Join Our Next Tour</Button>
            </div>
            <div className="relative">
              <img
                src="/images/google-campus.jpg"
                alt="Silicon Valley tech campus"
                className="rounded-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
