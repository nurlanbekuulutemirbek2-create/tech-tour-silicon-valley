"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GuestInfoStepProps {
  onNext: () => void
  onPrev: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function GuestInfoStep({ onNext, onPrev, onDataUpdate, data }: GuestInfoStepProps) {
  const [guestInfo, setGuestInfo] = useState(
    data.guestInfo || {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+1",
      numberOfGuests: 1,
      specialRequests: "",
    },
  )

  const handleInputChange = (field: string, value: any) => {
    const updatedInfo = { ...guestInfo, [field]: value }
    setGuestInfo(updatedInfo)
    onDataUpdate({ guestInfo: updatedInfo })
  }

  const handleNext = () => {
    if (guestInfo.fullName && guestInfo.email && guestInfo.phone) {
      onNext()
    }
  }

  const basePrice = data.selectedTour?.price || 0
  const totalPrice = basePrice * guestInfo.numberOfGuests

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Information</h2>
        <p className="text-gray-600">Please provide your details for the booking</p>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={guestInfo.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={guestInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex gap-2 mt-1">
                <Select
                  value={guestInfo.countryCode}
                  onValueChange={(value) => handleInputChange("countryCode", value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+33">+33</SelectItem>
                    <SelectItem value="+49">+49</SelectItem>
                    <SelectItem value="+81">+81</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  value={guestInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Select
                value={guestInfo.numberOfGuests.toString()}
                onValueChange={(value) => handleInputChange("numberOfGuests", Number.parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                value={guestInfo.specialRequests}
                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                placeholder="Accessibility needs, language preference, dietary restrictions, etc."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Pricing Summary */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="font-semibold text-gray-900 mb-4">Pricing Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base price per person</span>
            <span>${basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of guests</span>
            <span>{guestInfo.numberOfGuests}</span>
          </div>
          <div className="border-t border-green-300 pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-green-600">${totalPrice}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Date & Time
        </Button>
        <Button
          onClick={handleNext}
          disabled={!guestInfo.fullName || !guestInfo.email || !guestInfo.phone}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
