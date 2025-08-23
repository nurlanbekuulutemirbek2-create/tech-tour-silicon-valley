"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ConfirmationStepProps {
  data: any
}

export function ConfirmationStep({ data }: ConfirmationStepProps) {
  const bookingId = `TT${Date.now().toString().slice(-6)}`

  const handleAddToCalendar = (type: string) => {
    // Calendar integration logic would go here
    console.log(`Adding to ${type} calendar`)
  }

  const handleShare = (platform: string) => {
    // Social sharing logic would go here
    console.log(`Sharing on ${platform}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Thank you for choosing Tech Tour. Your adventure awaits!</p>
      </div>

      {/* Booking Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-semibold">{bookingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="font-semibold text-green-600">${data.paymentInfo?.total?.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">Tour</p>
            <p className="font-semibold">
              {data.selectedTour?.company} - {data.selectedTour?.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold">
                {data.date?.toLocaleDateString()} at {data.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-semibold">{data.guestInfo?.numberOfGuests} guest(s)</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-semibold">{data.guestInfo?.fullName}</p>
            <p className="text-gray-600">{data.guestInfo?.email}</p>
          </div>

          {data.guestInfo?.specialRequests && (
            <div>
              <p className="text-sm text-gray-500">Special Requests</p>
              <p className="text-gray-700">{data.guestInfo.specialRequests}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            You'll receive a confirmation email with your QR code within 5 minutes
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Present your QR code at the tour meeting point
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Arrive 15 minutes early for check-in
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="outline" onClick={() => handleAddToCalendar("google")} className="flex items-center gap-2">
            📅 Add to Google Calendar
          </Button>
          <Button variant="outline" onClick={() => handleAddToCalendar("apple")} className="flex items-center gap-2">
            📅 Add to Apple Calendar
          </Button>
          <Button variant="outline" onClick={() => handleAddToCalendar("outlook")} className="flex items-center gap-2">
            📅 Add to Outlook
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Share your excitement!</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
              Share on Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
              Share on Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>
              Share on LinkedIn
            </Button>
          </div>
        </div>
      </div>

      {/* Support */}
      <Card className="p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">Our support team is here to assist you</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" size="sm">
            📧 Email Support
          </Button>
          <Button variant="outline" size="sm">
            💬 Live Chat
          </Button>
          <Button variant="outline" size="sm">
            📞 Call Us
          </Button>
        </div>
      </Card>
    </div>
  )
}
