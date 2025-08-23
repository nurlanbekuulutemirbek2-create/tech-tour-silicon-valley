"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SelectTourStep } from "@/components/booking/select-tour-step"
import { DateTimeStep } from "@/components/booking/date-time-step"
import { GuestInfoStep } from "@/components/booking/guest-info-step"
import { PaymentStep } from "@/components/booking/payment-step"
import { ConfirmationStep } from "@/components/booking/confirmation-step"
import { AuthGuard } from "@/components/auth-guard"
import { useBooking } from "@/hooks/use-booking"
import { Tour } from "@/lib/booking-service"

function BookingContent() {
  const searchParams = useSearchParams()
  const { tours, fetchUniqueToursByCompany, loadingTours } = useBooking()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<{
    selectedTour: Tour | null;
    date: any;
    time: any;
    selectedSlot: any;
    guestInfo: {
      fullName: string;
      email: string;
      phone: string;
      countryCode: string;
      numberOfGuests: number;
      specialRequests: string;
    };
    paymentInfo: any;
  }>({
    selectedTour: null,
    date: null,
    time: null,
    selectedSlot: null,
    guestInfo: {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+1",
      numberOfGuests: 1,
      specialRequests: "",
    },
    paymentInfo: {}
  })

  // Fetch tours when component mounts
  useEffect(() => {
    fetchUniqueToursByCompany({ active: true })
  }, [fetchUniqueToursByCompany])

  // Handle pre-selected tour from URL parameter
  useEffect(() => {
    const tourParam = searchParams.get('tour')
    if (tourParam && tours.length > 0) {
      const selectedTour = tours.find(tour => tour.company === tourParam)
      if (selectedTour) {
        setBookingData(prev => ({ ...prev, selectedTour }))
        setCurrentStep(2) // Skip to date/time step
      }
    }
  }, [searchParams, tours])

  const handleDataUpdate = (newData: any) => {
    setBookingData(prev => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const renderStep = () => {
    // Show loading state while fetching tours
    if (loadingTours) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tours...</p>
          </div>
        </div>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <SelectTourStep
            onNext={nextStep}
            onDataUpdate={handleDataUpdate}
            data={bookingData}
          />
        )
      case 2:
        return (
          <DateTimeStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={handleDataUpdate}
            data={bookingData}
          />
        )
      case 3:
        return (
          <GuestInfoStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={handleDataUpdate}
            data={bookingData}
          />
        )
      case 4:
        return (
          <PaymentStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={handleDataUpdate}
            data={bookingData}
          />
        )
      case 5:
        return (
          <ConfirmationStep
            data={bookingData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book Your Tech Tour</h1>
          <p className="text-xl text-gray-600 mb-8">Secure your spot to explore the world's most innovative campuses</p>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step < currentStep 
                      ? 'bg-green-600 text-white' 
                      : step === currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-16">
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                Select Tour
              </span>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                Date & Time
              </span>
              <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                Guest Info
              </span>
              <span className={`text-sm font-medium ${currentStep >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                Payment
              </span>
              <span className={`text-sm font-medium ${currentStep >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
                Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStep()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Choose Tech Tour? */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Tech Tour?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">2,500+ Happy Visitors</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">4.9/5 Average Rating</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Secure Payment Processing</span>
                </li>
              </ul>
            </div>

            {/* What Our Visitors Say */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Our Visitors Say</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-gray-600 text-sm">"Amazing experience at Apple Park! The innovation center was mind-blowing."</p>
                  <p className="text-gray-900 font-medium text-sm mt-2">- Sarah M.</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-gray-600 text-sm">"Google campus tour exceeded expectations. Highly recommend!"</p>
                  <p className="text-gray-900 font-medium text-sm mt-2">- David L.</p>
                </div>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-green-100 text-sm">Our support team is here to assist you.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/auth">
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking page...</p>
          </div>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </AuthGuard>
  )
}
