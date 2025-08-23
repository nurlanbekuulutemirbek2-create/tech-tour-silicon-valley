"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { BookingProgress } from "@/components/booking/booking-progress"
import { SelectTourStep } from "@/components/booking/select-tour-step"
import { DateTimeStep } from "@/components/booking/date-time-step"
import { GuestInfoStep } from "@/components/booking/guest-info-step"
import { PaymentStep } from "@/components/booking/payment-step"
import { ConfirmationStep } from "@/components/booking/confirmation-step"
import { SeedDatabase } from "@/components/debug/seed-database"

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    selectedTour: null,
    date: null,
    time: null,
    guestInfo: null,
    paymentInfo: null,
  })

  const steps = ["Select Tour", "Date & Time", "Guest Info", "Payment", "Confirmation"]

  const updateBookingData = (stepData: any) => {
    setBookingData((prev) => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectTourStep onNext={nextStep} onDataUpdate={updateBookingData} data={bookingData} />
      case 2:
        return <DateTimeStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateBookingData} data={bookingData} />
      case 3:
        return <GuestInfoStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateBookingData} data={bookingData} />
      case 4:
        return <PaymentStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateBookingData} data={bookingData} />
      case 5:
        return <ConfirmationStep data={bookingData} />
      default:
        return <SelectTourStep onNext={nextStep} onDataUpdate={updateBookingData} data={bookingData} />
    }
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />

        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book Your Tech Tour</h1>
          <p className="text-xl text-gray-600 mb-8">Secure your spot to explore the world's most innovative campuses</p>

          <BookingProgress currentStep={currentStep} steps={steps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            {renderStep()}
            
            {/* Temporary Debug Component */}
            <div className="mt-8">
              <SeedDatabase />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Elements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose Tech Tour?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">2,500+ Happy Visitors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">4.9/5 Average Rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Secure Payment Processing</span>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-4">What Our Visitors Say</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-600 mb-2">
                    "Amazing experience at Apple Park! The innovation center was mind-blowing."
                  </p>
                  <p className="text-xs text-gray-500">- Sarah M.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-600 mb-2">
                    "Google campus tour exceeded expectations. Highly recommend!"
                  </p>
                  <p className="text-xs text-gray-500">- David L.</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-green-100 mb-4">Our support team is here to assist you</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
