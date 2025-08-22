import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Software Engineer",
    company: "Stripe",
    rating: 5,
    tour: "Silicon Valley Grand Tour",
    date: "February 2025",
    review:
      "Absolutely incredible experience! Getting to see the inside of Apple Park and meet engineers at Google was a dream come true. The tour guide was knowledgeable and the small group size made it feel personal.",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Manager",
    company: "Microsoft",
    rating: 5,
    tour: "Innovation Deep Dive",
    date: "January 2025",
    review:
      "The Tesla factory tour was mind-blowing! Seeing the robots in action and learning about sustainable manufacturing was fascinating. Netflix's content creation process was equally impressive.",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: 3,
    name: "Emily Watson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "CS Student",
    company: "Stanford University",
    rating: 5,
    tour: "Tech Startup Ecosystem",
    date: "January 2025",
    review:
      "Perfect for understanding the startup landscape! Met founders, VCs, and got insights into what it takes to build a tech company. Highly recommend for anyone considering entrepreneurship.",
    images: [],
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Data Scientist",
    company: "Airbnb",
    rating: 4,
    tour: "AI & Machine Learning Focus",
    date: "December 2024",
    review:
      "Great technical depth! The AI labs visit was exceptional and the discussions with researchers were invaluable. Only wish we had more time at each location.",
    images: ["/placeholder.svg?height=200&width=300"],
  },
]

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Reviews & Experiences
          </Badge>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">What Our Visitors Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real experiences from tech professionals, students, and enthusiasts
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                    <AvatarFallback>
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{review.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {review.tour}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.role} at {review.company}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted/20" />
                  <p className="text-muted-foreground leading-relaxed pl-6">{review.review}</p>
                </div>

                {review.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Read All Reviews
          </Button>
        </div>
      </div>
    </section>
  )
}
