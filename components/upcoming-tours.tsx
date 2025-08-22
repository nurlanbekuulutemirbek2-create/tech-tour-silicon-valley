import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

const upcomingTours = [
  {
    id: 1,
    title: "Silicon Valley Grand Tour",
    description: "Visit Apple, Google, and Meta in one comprehensive day",
    date: "March 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Multiple Locations",
    attendees: 18,
    maxAttendees: 25,
    price: "$299",
    companies: ["Apple", "Google", "Meta"],
    status: "Available",
  },
  {
    id: 2,
    title: "Innovation Deep Dive",
    description: "Tesla and Netflix: Transportation meets Entertainment",
    date: "March 18, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Palo Alto & Los Gatos",
    attendees: 12,
    maxAttendees: 20,
    price: "$249",
    companies: ["Tesla", "Netflix"],
    status: "Available",
  },
  {
    id: 3,
    title: "Tech Startup Ecosystem",
    description: "Explore emerging startups and venture capital firms",
    date: "March 22, 2025",
    time: "1:00 PM - 7:00 PM",
    location: "San Francisco",
    attendees: 8,
    maxAttendees: 15,
    price: "$199",
    companies: ["Various Startups"],
    status: "Available",
  },
  {
    id: 4,
    title: "AI & Machine Learning Focus",
    description: "Deep dive into AI labs and research facilities",
    date: "March 25, 2025",
    time: "9:30 AM - 5:30 PM",
    location: "Mountain View & Palo Alto",
    attendees: 22,
    maxAttendees: 25,
    price: "$349",
    companies: ["Google", "OpenAI", "Various AI Labs"],
    status: "Almost Full",
  },
]

export function UpcomingTours() {
  return (
    <section id="tours" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Upcoming Tours
          </Badge>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Join Our Next Adventure</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Book your spot on these carefully curated tech experiences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {upcomingTours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif text-xl mb-2">{tour.title}</CardTitle>
                    <p className="text-muted-foreground">{tour.description}</p>
                  </div>
                  <Badge variant={tour.status === "Almost Full" ? "destructive" : "secondary"} className="ml-2">
                    {tour.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {tour.attendees}/{tour.maxAttendees} attendees
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Companies Included:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tour.companies.map((company) => (
                      <Badge key={company} variant="outline" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-primary">{tour.price}</span>
                    <span className="text-muted-foreground ml-1">per person</span>
                  </div>
                  <Button className="px-6" disabled={tour.status === "Almost Full"}>
                    {tour.status === "Almost Full" ? "Join Waitlist" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Tours
          </Button>
        </div>
      </div>
    </section>
  )
}
