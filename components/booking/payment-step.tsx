"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/hooks/use-booking"
import { useAuthContext } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface PaymentStepProps {
  onNext: () => void
  onPrev: () => void
  onDataUpdate: (data: any) => void
  data: any
}

export function PaymentStep({ onNext, onPrev, onDataUpdate, data }: PaymentStepProps) {
  const { createBooking } = useBooking()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const basePrice = (data.selectedTour?.price || 0) * (data.guestInfo?.numberOfGuests || 1)
  const discount = promoApplied ? basePrice * 0.1 : 0
  const taxes = (basePrice - discount) * 0.08
  const totalPrice = basePrice - discount + taxes

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
    }
  }

  const validateCardDetails = () => {
    if (paymentMethod === "card") {
      const errors = []
      
      // Card number validation
      const cardNumberClean = cardInfo.cardNumber.replace(/\s/g, '')
      if (!cardInfo.cardNumber) {
        errors.push("Card number is required")
      } else if (cardNumberClean.length < 13) {
        errors.push("Card number must be at least 13 digits")
      } else if (cardNumberClean.length > 19) {
        errors.push("Card number cannot exceed 19 digits")
      } else if (!/^\d+$/.test(cardNumberClean)) {
        errors.push("Card number must contain only numbers")
      }
      
      // Expiry date validation
      if (!cardInfo.expiryDate) {
        errors.push("Expiry date is required")
      } else if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
        errors.push("Expiry date must be in MM/YY format")
      } else {
        const [month, year] = cardInfo.expiryDate.split('/').map(Number)
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1
        
        if (month < 1 || month > 12) {
          errors.push("Month must be between 01 and 12")
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errors.push("Card has expired")
        }
      }
      
      // CVV validation
      if (!cardInfo.cvv) {
        errors.push("CVV is required")
      } else if (cardInfo.cvv.length < 3) {
        errors.push("CVV must be at least 3 digits")
      } else if (cardInfo.cvv.length > 4) {
        errors.push("CVV cannot exceed 4 digits")
      } else if (!/^\d+$/.test(cardInfo.cvv)) {
        errors.push("CVV must contain only numbers")
      }
      
      // Cardholder name validation
      if (!cardInfo.cardholderName) {
        errors.push("Cardholder name is required")
      } else if (cardInfo.cardholderName.trim().length < 2) {
        errors.push("Cardholder name must be at least 2 characters")
      } else if (cardInfo.cardholderName.trim().length > 50) {
        errors.push("Cardholder name cannot exceed 50 characters")
      } else if (!/^[a-zA-Z\s]+$/.test(cardInfo.cardholderName.trim())) {
        errors.push("Cardholder name can only contain letters and spaces")
      }
      
      return errors
    }
    return []
  }

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to complete your booking.",
        variant: "destructive",
      })
      return
    }

    // Validate card details if card payment is selected
    const validationErrors = validateCardDetails()
    if (validationErrors.length > 0) {
      // Set field errors for visual feedback
      const newFieldErrors: {[key: string]: string} = {}
      validationErrors.forEach(error => {
        if (error.includes("Card number")) newFieldErrors.cardNumber = error
        else if (error.includes("Expiry date") || error.includes("expired")) newFieldErrors.expiryDate = error
        else if (error.includes("CVV")) newFieldErrors.cvv = error
        else if (error.includes("Cardholder name")) newFieldErrors.cardholderName = error
      })
      setFieldErrors(newFieldErrors)
      
      toast({
        title: "Please fix the following errors:",
        description: validationErrors.join(", "),
        variant: "destructive",
      })
      return
    }
    
    // Clear field errors if validation passes
    setFieldErrors({})

    setIsProcessing(true)

    try {
      // Prepare booking data
      const bookingData = {
        userId: user.uid,
        tourId: data.selectedTour.id,
        tourName: `${data.selectedTour.company} - ${data.selectedTour.location}`,
        date: data.selectedSlot.date,
        time: data.time,
        guestCount: data.guestInfo.numberOfGuests,
        guestInfo: {
          firstName: data.guestInfo.fullName.split(' ')[0] || data.guestInfo.fullName,
          lastName: data.guestInfo.fullName.split(' ').slice(1).join(' ') || '',
          email: data.guestInfo.email,
          phone: data.guestInfo.phone,
        },
        totalPrice: totalPrice,
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: paymentMethod,
        specialRequests: data.guestInfo.specialRequests || null,
      }

      // Create booking in Firebase
      const bookingId = await createBooking(bookingData)

      // Update local data with booking info
      onDataUpdate({
        paymentInfo: {
          method: paymentMethod,
          total: totalPrice,
          promoCode: promoApplied ? promoCode : null,
          bookingId: bookingId,
        },
      })

      toast({
        title: "Booking Confirmed!",
        description: `Your booking has been saved successfully. Booking ID: ${bookingId}`,
      })

      onNext()
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Booking Error",
        description: "Failed to save your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
        <p className="text-gray-600">Complete your booking with our secure payment system</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <div className="flex items-center gap-2">
                  <span>Credit/Debit Card</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      Visa
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      MC
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Amex
                    </Badge>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <span>PayPal</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="apple"
                  checked={paymentMethod === "apple"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <span>Apple Pay</span>
              </label>
            </div>
          </Card>

          {/* Card Details */}
          {paymentMethod === "card" && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.cardNumber}
                    onChange={(e) => {
                      setCardInfo({ ...cardInfo, cardNumber: formatCardNumber(e.target.value) })
                      if (fieldErrors.cardNumber) {
                        setFieldErrors(prev => ({ ...prev, cardNumber: '' }))
                      }
                    }}
                    maxLength={19}
                    className={`mt-1 ${fieldErrors.cardNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {fieldErrors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardInfo.expiryDate}
                      onChange={(e) => {
                        setCardInfo({ ...cardInfo, expiryDate: formatExpiryDate(e.target.value) })
                        if (fieldErrors.expiryDate) {
                          setFieldErrors(prev => ({ ...prev, expiryDate: '' }))
                        }
                      }}
                      maxLength={5}
                      className={`mt-1 ${fieldErrors.expiryDate ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {fieldErrors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={(e) => {
                        setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '') })
                        if (fieldErrors.cvv) {
                          setFieldErrors(prev => ({ ...prev, cvv: '' }))
                        }
                      }}
                      maxLength={4}
                      className={`mt-1 ${fieldErrors.cvv ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {fieldErrors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardInfo.cardholderName}
                    onChange={(e) => {
                      setCardInfo({ ...cardInfo, cardholderName: e.target.value })
                      if (fieldErrors.cardholderName) {
                        setFieldErrors(prev => ({ ...prev, cardholderName: '' }))
                      }
                    }}
                    className={`mt-1 ${fieldErrors.cardholderName ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {fieldErrors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.cardholderName}</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Promo Code */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Promo Code</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
              />
              <Button variant="outline" onClick={handlePromoApply} disabled={promoApplied || !promoCode}>
                {promoApplied ? "Applied" : "Apply"}
              </Button>
            </div>
            {promoApplied && <p className="text-green-600 text-sm mt-2">✓ 10% discount applied!</p>}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            {/* Tour Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">{data.selectedTour?.company} Tour</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{data.selectedTour?.location}</p>
                <p>
                  {data.date?.toLocaleDateString()} at {data.time}
                </p>
                <p>{data.guestInfo?.numberOfGuests} guest(s)</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Pricing Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (WELCOME10)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-500">
              <Badge variant="outline">🔒 SSL Secured</Badge>
              <Badge variant="outline">💳 PCI Compliant</Badge>
            </div>

            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
            >
              {isProcessing ? "Processing..." : "Complete Booking"}
            </Button>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Guest Info
        </Button>
      </div>
    </div>
  )
}
