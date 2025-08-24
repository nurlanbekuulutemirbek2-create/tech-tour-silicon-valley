"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/contexts/auth-context"
import { useBooking } from "@/hooks/use-booking"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { format } from "date-fns"
import { Calendar, MapPin, Clock, Users, DollarSign, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const { fetchUserBookings, userBookings, loadingBookings, errorBookings } = useBooking()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchUserBookings()
    }
  }, [user, fetchUserBookings])

  // Show error toast if there's an error
  useEffect(() => {
    if (errorBookings) {
      toast({
        title: "Error",
        description: "Failed to load your booking history.",
        variant: "destructive",
      })
    }
  }, [errorBookings, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <ClockIcon className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-xl text-gray-600">Manage your account and view your booking history</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="bookings" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                  <TabsTrigger value="profile">Account Info</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Booking History</h2>
                    <Badge variant="outline">{userBookings.length} bookings</Badge>
                  </div>

                  {loadingBookings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your bookings...</p>
                      </div>
                    </div>
                  ) : userBookings.length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-600 mb-6">Start your tech adventure by booking your first tour!</p>
                      <Button asChild>
                        <a href="/">Explore Tours</a>
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userBookings.map((booking: any) => (
                        <Card key={booking.id} className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{booking.tourName}</h3>
                              <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </div>
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{format(booking.date.toDate(), 'EEEE, MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{booking.guestCount} guest(s)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span>${booking.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <p className="text-gray-600">Contact</p>
                                <p className="font-medium">{booking.guestInfo.firstName} {booking.guestInfo.lastName}</p>
                                <p className="text-gray-600">{booking.guestInfo.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Payment</p>
                                <p className="font-medium">{booking.paymentMethod}</p>
                                <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                  {booking.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="border-t pt-4 mt-4">
                              <p className="text-sm text-gray-600">Special Requests</p>
                              <p className="text-gray-900">{booking.specialRequests}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                  
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Display Name</label>
                        <p className="text-gray-900">{user?.displayName || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Account Created</label>
                        <p className="text-gray-900">
                          {user?.metadata?.creationTime 
                            ? format(new Date(user.metadata.creationTime), 'MMMM d, yyyy')
                            : 'Unknown'
                          }
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">Account Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Total Bookings</p>
                        <p className="font-semibold text-blue-900">{userBookings.length}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Confirmed Bookings</p>
                        <p className="font-semibold text-blue-900">
                          {userBookings.filter((b: any) => b.status === 'confirmed').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600">Completed Tours</p>
                        <p className="font-semibold text-blue-900">
                          {userBookings.filter((b: any) => b.status === 'completed').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600">Total Spent</p>
                        <p className="font-semibold text-blue-900">
                          ${userBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{userBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming Tours</span>
                    <span className="font-semibold text-green-600">
                      {userBookings.filter((b: any) => b.status === 'confirmed' && b.date.toDate() > new Date()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Tours</span>
                    <span className="font-semibold text-blue-600">
                      {userBookings.filter((b: any) => b.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Need Help? */}
              <Card className="p-6 bg-green-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-green-100 text-sm mb-4">Our support team is here to assist you.</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full text-green-600 bg-white hover:bg-green-50">
                    📧 Email Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-green-600 bg-white hover:bg-green-50">
                    💬 Live Chat
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
