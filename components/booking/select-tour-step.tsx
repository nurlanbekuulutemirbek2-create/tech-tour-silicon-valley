"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tours = [
  {
    id: "apple",
    company: "Apple",
    location: "Apple Park, Cupertino",
    description: "Explore the iconic Apple Park campus and visitor center",
    highlights: ["Innovation Hub", "Campus Walk", "Visitor Center", "Apple Store"],
    rating: 4.9,
    duration: "3 hours",
    price: 89,
    image: "/placeholder-tsz55.png",
    popular: true,
  },
  {
    id: "google",
    company: "Google",
    location: "Googleplex, Mountain View",
    description: "Discover the colorful world of Google's headquarters",
    highlights: ["Android Lawn", "Campus Tour", "Innovation Labs", "Google Store"],
    rating: 4.8,
    duration: "2.5 hours",
    price: 79,
    image: "/placeholder-ajt2y.png",
    trending: true,
  },
  {
    id: "meta",
    company: "Meta",
    location: "Meta HQ, Menlo Park",
    description: "Step into the future of social connection and VR",
    highlights: ["VR Experience", "Campus Walk", "Innovation Center", "Photo Ops"],
    rating: 4.7,
    duration: "2 hours",
    price: 69,
    image: "/placeholder-39dqp.png",
  },
  {
    id: "tesla",
    company: "Tesla",
    location: "Tesla Factory, Fremont",
    description: "Witness the future of sustainable transportation",
    highlights: ["Factory Tour", "Model Showcase", "Supercharger Demo", "Innovation Talk"],
    rating: 4.8,
    duration: "3.5 hours",
    price: 99,
    image: "/placeholder-q8bjt.png",
  },
  {
    id: "netflix",
    company: "Netflix",
    location: "Netflix HQ, Los Gatos",
    description: "Go behind the scenes of the streaming revolution",
    highlights: ["Studio Tour", "Content Creation", "Tech Demo", "Exclusive Previews"],
    rating: 4.6,
    duration: "2 hours",
    price: 75,
    image: "/placeholder-nhnoo.png",
  },
]

interface SelectTourStepProps {
  onNext: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function SelectTourStep({ onNext, onDataUpdate, data }: SelectTourStepProps) {
  const [selectedTour, setSelectedTour] = useState(data.selectedTour)

  const handleTourSelect = (tour: any) => {
    setSelectedTour(tour)
    onDataUpdate({ selectedTour: tour })
  }

  const handleNext = () => {
    if (selectedTour) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Tech Tour</h2>
        <p className="text-gray-600">Select from our exclusive collection of Silicon Valley experiences</p>
      </div>

      <div className="grid gap-6">
        {tours.map((tour) => (
          <Card
            key={tour.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedTour?.id === tour.id ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
            }`}
            onClick={() => handleTourSelect(tour)}
          >
            <div className="flex gap-6">
              <img
                src={tour.image || "/placeholder.svg"}
                alt={`${tour.company} campus`}
                className="w-32 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tour.company}</h3>
                    <p className="text-gray-600">{tour.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${tour.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{tour.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {tour.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{tour.rating}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{tour.duration}</span>
                  </div>

                  <div className="flex gap-2">
                    {tour.popular && <Badge className="bg-orange-100 text-orange-700">Most Popular</Badge>}
                    {tour.trending && <Badge className="bg-blue-100 text-blue-700">Trending</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleNext} disabled={!selectedTour} className="bg-green-600 hover:bg-green-700 px-8">
          Continue to Date & Time
        </Button>
      </div>
    </div>
  )
}
