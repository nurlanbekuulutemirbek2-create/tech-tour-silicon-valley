"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Play, Star, Users, Calendar } from "lucide-react"

const tourLocations = [
  {
    id: 1,
    name: "Apple Park",
    logo: "A",
    nextTour: "2:30 PM",
    image: "/images/apple-park.jpg",
    description: "The spaceship campus",
    rating: 4.9,
    reviews: 1247,
  },
  {
    id: 2,
    name: "Google",
    logo: "G",
    nextTour: "1:45 PM",
    image: "/images/google-campus.jpg",
    description: "The Googleplex",
    rating: 4.8,
    reviews: 1156,
  },
  {
    id: 3,
    name: "Stanford",
    logo: "S",
    nextTour: "3:15 PM",
    image: "/images/stanford-university.jpg",
    description: "Innovation hub",
    rating: 4.7,
    reviews: 892,
  },
]

export function InnovativeHero() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleBookTour = () => {
    router.push("/booking")
  }

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Rotate through locations every 6 seconds with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentLocationIndex((prevIndex) => (prevIndex + 1) % tourLocations.length)
        setIsTransitioning(false)
      }, 800) // Wait for fade out before changing content
    }, 6000) // Increased to 6 seconds for slower rotation

    return () => clearInterval(interval)
  }, [])

  const currentLocation = tourLocations[currentLocationIndex]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Tech Icons */}
        <div
          className="absolute top-20 left-10 w-16 h-16 bg-primary/10 rounded-full animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute top-40 right-20 w-12 h-12 bg-secondary/20 rounded-full animate-float"
          style={{
            animationDelay: "1s",
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * 0.03}px)`,
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-20 h-20 bg-accent/15 rounded-full animate-float"
          style={{
            animationDelay: "2s",
            transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.025}px)`,
          }}
        />

        {/* Parallax Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/placeholder.svg?height=100&width=100')`,
            backgroundSize: "200px 200px",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? "animate-slide-in-up" : "opacity-0"}`}>
            {/* Badge */}
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium animate-pulse-glow"
            >
              <MapPin className="w-4 h-4" />
              Silicon Valley & San Francisco
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight">
                Experience
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                  Tech Innovation
                </span>
                <span className="block text-foreground">Like Never Before</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Step inside the world's most innovative companies. From Apple Park to Google's campus, discover where
                tomorrow's technology is born today.
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">2,500+</div>
                  <div className="text-sm text-muted-foreground">Happy Visitors</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-lg">15+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleBookTour}
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10">Book Your Tour</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Preview
              </Button>
            </div>
          </div>

          {/* Right Visual - Rotating Locations */}
          <div
            className={`relative ${isVisible ? "animate-slide-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={currentLocation.image}
                  alt={`${currentLocation.name} campus`}
                  className={`w-full h-[600px] object-cover transition-all duration-1500 ease-in-out ${
                    isTransitioning ? "opacity-30 scale-95" : "opacity-100 scale-100"
                  }`}
                />

                {/* Overlay Cards */}
                <div 
                  className={`absolute top-6 left-6 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-float transition-all duration-1200 ease-in-out ${
                    isTransitioning ? "opacity-30 transform translate-y-2" : "opacity-100 transform translate-y-0"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center transition-all duration-1200">
                      <span className="text-primary-foreground font-bold text-lg transition-all duration-1200">
                        {currentLocation.logo}
                      </span>
                    </div>
                    <div className="transition-all duration-1200">
                      <div className={`font-semibold text-card-foreground transition-all duration-1200 ${
                        isTransitioning ? "opacity-50" : "opacity-100"
                      }`}>
                        {currentLocation.name}
                      </div>
                      <div className={`text-sm text-muted-foreground transition-all duration-1200 ${
                        isTransitioning ? "opacity-50" : "opacity-100"
                      }`}>
                        Next tour: {currentLocation.nextTour}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute bottom-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-float transition-all duration-1200 ease-in-out ${
                    isTransitioning ? "opacity-30 transform translate-y-2" : "opacity-100 transform translate-y-0"
                  }`}
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`font-semibold transition-all duration-1200 ${
                      isTransitioning ? "opacity-50" : "opacity-100"
                    }`}>
                      {currentLocation.rating}
                    </span>
                    <span className={`text-sm text-muted-foreground transition-all duration-1200 ${
                      isTransitioning ? "opacity-50" : "opacity-100"
                    }`}>
                      ({currentLocation.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Location Indicator Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {tourLocations.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-800 ease-in-out ${
                        index === currentLocationIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 scale-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full opacity-20 animate-pulse"
                style={{
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 animate-pulse"
                style={{
                  animationDelay: "1s",
                  transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-background">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>
    </section>
  )
}
