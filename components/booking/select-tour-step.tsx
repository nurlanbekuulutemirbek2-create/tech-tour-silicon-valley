"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/hooks/use-booking"
import { Tour } from "@/lib/booking-service"
import { Loader2 } from "lucide-react"

interface SelectTourStepProps {
  onNext: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function SelectTourStep({ onNext, onDataUpdate, data }: SelectTourStepProps) {
  const { tours, loadingTours, errorTours, fetchTours } = useBooking()
  const [selectedTour, setSelectedTour] = useState<Tour | null>(data.selectedTour)

  useEffect(() => {
    fetchTours({ active: true })
  }, [fetchTours])

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour)
    onDataUpdate({ selectedTour: tour })
  }

  const handleNext = () => {
    if (selectedTour) {
      onNext()
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (loadingTours) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading tours...</span>
      </div>
    )
  }

  if (errorTours) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading tours: {errorTours}</p>
        <Button onClick={() => fetchTours({ active: true })} variant="outline">
          Try Again
        </Button>
      </div>
    )
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
                    <span className="text-gray-600">{formatDuration(tour.duration)}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{tour.availableSlots} spots left</span>
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

      {tours.length === 0 && !loadingTours && (
        <div className="text-center py-12">
          <p className="text-gray-600">No tours available at the moment.</p>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button 
          onClick={handleNext} 
          disabled={!selectedTour} 
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          Continue to Date & Time
        </Button>
      </div>
    </div>
  )
}
