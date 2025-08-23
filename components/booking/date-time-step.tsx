"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useBooking } from "@/hooks/use-booking"
import { AvailableSlot } from "@/lib/booking-service"
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react"
import { format, addDays, startOfDay } from "date-fns"

interface DateTimeStepProps {
  onNext: () => void
  onPrev: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function DateTimeStep({ onNext, onPrev, onDataUpdate, data }: DateTimeStepProps) {
  const { availableSlots, loadingSlots, errorSlots, fetchAvailableSlots } = useBooking()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(data.time)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(data.selectedSlot)

  // Memoize date range to prevent infinite re-renders
  const dateRange = useMemo(() => {
    const startDate = startOfDay(new Date())
    const endDate = addDays(startDate, 30)
    return { startDate, endDate }
  }, [])

  useEffect(() => {
    if (data.selectedTour?.id) {
      console.log('🔄 Fetching available slots for tour:', data.selectedTour.id)
      fetchAvailableSlots(data.selectedTour.id, dateRange.startDate, dateRange.endDate)
    }
  }, [data.selectedTour?.id, fetchAvailableSlots, dateRange.startDate, dateRange.endDate])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined)
    setSelectedSlot(null)
    onDataUpdate({ date, time: undefined, selectedSlot: null })
  }

  const handleTimeSelect = (slot: AvailableSlot) => {
    setSelectedTime(slot.time)
    setSelectedSlot(slot)
    onDataUpdate({ 
      date: selectedDate, 
      time: slot.time, 
      selectedSlot: slot 
    })
  }

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedSlot) {
      onNext()
    }
  }

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date.toDate(), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(slot)
    return acc
  }, {} as Record<string, AvailableSlot[]>)

  // Get available times for selected date, filtered by current time if today
  const availableTimesForDate = selectedDate 
    ? (slotsByDate[format(selectedDate, 'yyyy-MM-dd')] || []).filter(slot => {
        // If selected date is today, filter out past time slots
        const today = new Date()
        const isToday = format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        
        if (isToday) {
          const currentHour = today.getHours()
          const currentMinute = today.getMinutes()
          
          // Parse the slot time (assuming format like "13:00" or "16:00")
          const timeParts = slot.time.split(':')
          if (timeParts.length !== 2) {
            console.warn(`Invalid time format: ${slot.time}`)
            return true // Keep invalid formats to avoid breaking the UI
          }
          
          const [slotHour, slotMinute] = timeParts.map(Number)
          
          // Check if slot time is in the past
          if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
            return false
          }
        }
        
        return true
      })
    : []

  // Disable dates that have no available slots or only past slots for today
  const disabledDates = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    const slotsForDate = slotsByDate[dateKey] || []
    
    if (slotsForDate.length === 0) {
      return true
    }
    
    // If it's today, check if there are any future time slots
    const today = new Date()
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    
    if (isToday) {
      const currentHour = today.getHours()
      const currentMinute = today.getMinutes()
      
      // Check if any slots are in the future
      const hasFutureSlots = slotsForDate.some(slot => {
        const timeParts = slot.time.split(':')
        if (timeParts.length !== 2) {
          console.warn(`Invalid time format: ${slot.time}`)
          return true // Keep invalid formats to avoid breaking the UI
        }
        
        const [slotHour, slotMinute] = timeParts.map(Number)
        return slotHour > currentHour || (slotHour === currentHour && slotMinute > currentMinute)
      })
      
      return !hasFutureSlots
    }
    
    return false
  }

  if (loadingSlots) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading available dates...</span>
      </div>
    )
  }

  if (errorSlots) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading available dates: {errorSlots}</p>
        <Button onClick={() => fetchAvailableSlots(data.selectedTour.id, dateRange.startDate, dateRange.endDate)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose when you'd like to visit {data.selectedTour?.company}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Select Date</h3>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            initialFocus
            className="rounded-md border"
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• Available dates are highlighted</p>
            <p>• Grayed out dates have no available slots</p>
            <p>• Today only shows future time slots</p>
          </div>
        </Card>

        {/* Time Slots */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Select Time</h3>
          </div>

          {selectedDate ? (
            <div className="space-y-3">
              {availableTimesForDate.length > 0 ? (
                availableTimesForDate.map((slot) => (
                  <Button
                    key={`${slot.date.toDate().toISOString()}-${slot.time}`}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={`w-full justify-between p-4 h-auto ${
                      selectedTime === slot.time 
                        ? "bg-green-600 text-white" 
                        : "hover:bg-green-50"
                    }`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-sm opacity-80">
                        {slot.availableSpots} spots available
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${slot.price}</div>
                      <div className="text-sm opacity-80">per person</div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') 
                      ? "No future time slots available for today" 
                      : "No available times for this date"
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ? "All slots for today have passed. Please select a future date."
                      : "Please select a different date"
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Please select a date first</p>
            </div>
          )}
        </Card>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime && selectedSlot && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-3">Selected Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <span className="ml-2 font-medium">{selectedTime}</span>
            </div>
            <div>
              <span className="text-gray-600">Available Spots:</span>
              <span className="ml-2 font-medium">{selectedSlot.availableSpots}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="ml-2 font-medium">${selectedSlot.price} per person</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between pt-6">
        <Button onClick={onPrev} variant="outline">
          Back to Tour Selection
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!selectedDate || !selectedTime || !selectedSlot}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          Continue to Guest Info
        </Button>
      </div>
    </div>
  )
}
