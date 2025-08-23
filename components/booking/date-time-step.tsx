"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

const timeSlots = [
  { time: "9:00 AM", available: true, popular: false },
  { time: "10:30 AM", available: true, popular: true },
  { time: "12:00 PM", available: true, popular: false },
  { time: "1:30 PM", available: true, popular: true },
  { time: "3:00 PM", available: false, popular: false },
  { time: "4:30 PM", available: true, popular: false },
]

interface DateTimeStepProps {
  onNext: () => void
  onPrev: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function DateTimeStep({ onNext, onPrev, onDataUpdate, data }: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date)
  const [selectedTime, setSelectedTime] = useState(data.time)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onDataUpdate({ date })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onDataUpdate({ time })
  }

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred tour date and time slot</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Choose Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            className="rounded-md border"
          />
          <p className="text-sm text-gray-500 mt-2">Tours are not available on Sundays</p>
        </Card>

        {/* Time Slots */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Available Times</h3>
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-lg text-sm font-medium transition-all relative
                    ${
                      selectedTime === slot.time
                        ? "bg-green-500 text-white"
                        : slot.available
                          ? "bg-gray-50 text-gray-900 hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {slot.time}
                  {slot.popular && slot.available && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-xs px-1 py-0">Popular</Badge>
                  )}
                  {!slot.available && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs">Full</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Please select a date first</p>
          )}

          {selectedDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Limited spots:</span> Only 5 spots left for this date!
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Tour Selection
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue to Guest Info
        </Button>
      </div>
    </div>
  )
}
