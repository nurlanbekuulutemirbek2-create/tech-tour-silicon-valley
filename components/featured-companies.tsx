import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users } from "lucide-react"

const companies = [
  {
    name: "Apple",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Visit the iconic Apple Park and learn about revolutionary product design.",
    location: "Cupertino",
    duration: "3 hours",
    maxAttendees: 25,
    highlights: ["Apple Park Visitor Center", "Design Philosophy", "Innovation History"],
    color: "from-gray-900 to-gray-700",
  },
  {
    name: "Google",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Explore the Googleplex and discover how search changed the world.",
    location: "Mountain View",
    duration: "2.5 hours",
    maxAttendees: 30,
    highlights: ["Googleplex Campus", "AI & Machine Learning", "Company Culture"],
    color: "from-blue-600 to-blue-400",
  },
  {
    name: "Meta",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Step into the metaverse at Meta's headquarters and VR labs.",
    location: "Menlo Park",
    duration: "2 hours",
    maxAttendees: 20,
    highlights: ["VR/AR Demos", "Social Impact", "Future of Connection"],
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Netflix",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Go behind the scenes of content creation and streaming technology.",
    location: "Los Gatos",
    duration: "2.5 hours",
    maxAttendees: 15,
    highlights: ["Content Studios", "Streaming Tech", "Global Entertainment"],
    color: "from-red-600 to-red-400",
  },
  {
    name: "Tesla",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Experience the future of transportation and sustainable energy.",
    location: "Palo Alto",
    duration: "3 hours",
    maxAttendees: 20,
    highlights: ["Vehicle Showcase", "Autopilot Tech", "Sustainable Energy"],
    color: "from-red-500 to-orange-500",
  },
]

export function FeaturedCompanies() {
  return (
    <section id="companies" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Featured Companies
          </Badge>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Tour Silicon Valley's Tech Giants</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get exclusive access to the companies that shaped the digital world
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.name} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`h-32 bg-gradient-to-br ${company.color} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/90 p-2">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">{company.name}</h3>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{company.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{company.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Max {company.maxAttendees} attendees</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Tour Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full group-hover:bg-primary/90 transition-colors">Book {company.name} Tour</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
