"use client"

import { useState, useEffect, useCallback } from 'react'
import { BookingService, Tour, Booking, AvailableSlot, UserProfile } from '@/lib/booking-service'
import { useAuthContext } from '@/contexts/auth-context'

interface UseBookingReturn {
  // Tours
  tours: Tour[]
  loadingTours: boolean
  errorTours: string | null
  fetchTours: (filters?: any) => Promise<void>
  
  // Available Slots
  availableSlots: AvailableSlot[]
  loadingSlots: boolean
  errorSlots: string | null
  fetchAvailableSlots: (tourId: string, startDate: Date, endDate: Date) => Promise<void>
  
  // User Bookings
  userBookings: Booking[]
  loadingBookings: boolean
  errorBookings: string | null
  fetchUserBookings: (status?: Booking['status']) => Promise<void>
  
  // User Profile
  userProfile: UserProfile | null
  loadingProfile: boolean
  errorProfile: string | null
  fetchUserProfile: () => Promise<void>
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>
  
  // Actions
  createBooking: (bookingData: any) => Promise<string>
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>
  searchTours: (searchTerm: string) => Promise<Tour[]>
  
  // Pagination
  hasMoreTours: boolean
  loadMoreTours: () => Promise<void>
}

export function useBooking(): UseBookingReturn {
  const { user } = useAuthContext()
  
  // Tours state
  const [tours, setTours] = useState<Tour[]>([])
  const [loadingTours, setLoadingTours] = useState(false)
  const [errorTours, setErrorTours] = useState<string | null>(null)
  const [lastTourDoc, setLastTourDoc] = useState<any>(null)
  const [hasMoreTours, setHasMoreTours] = useState(true)
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [errorSlots, setErrorSlots] = useState<string | null>(null)
  
  // User bookings state
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [errorBookings, setErrorBookings] = useState<string | null>(null)
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [errorProfile, setErrorProfile] = useState<string | null>(null)
  
  // Fetch tours with caching
  const fetchTours = useCallback(async (filters?: any) => {
    if (!user) return
    
    setLoadingTours(true)
    setErrorTours(null)
    
    try {
      const toursData = await BookingService.getTours(filters)
      setTours(toursData)
    } catch (error) {
      setErrorTours(error instanceof Error ? error.message : 'Failed to fetch tours')
    } finally {
      setLoadingTours(false)
    }
  }, [user])
  
  // Fetch paginated tours
  const loadMoreTours = useCallback(async () => {
    if (!user || loadingTours || !hasMoreTours) return
    
    setLoadingTours(true)
    
    try {
      const result = await BookingService.getToursPaginated(10, lastTourDoc)
      setTours(prev => [...prev, ...result.tours])
      setLastTourDoc(result.lastDoc)
      setHasMoreTours(!!result.lastDoc)
    } catch (error) {
      setErrorTours(error instanceof Error ? error.message : 'Failed to load more tours')
    } finally {
      setLoadingTours(false)
    }
  }, [user, loadingTours, hasMoreTours, lastTourDoc])
  
  // Fetch available slots
  const fetchAvailableSlots = useCallback(async (tourId: string, startDate: Date, endDate: Date) => {
    setLoadingSlots(true)
    setErrorSlots(null)
    
    try {
      const slots = await BookingService.getAvailableSlots(tourId, startDate, endDate)
      setAvailableSlots(slots)
    } catch (error) {
      setErrorSlots(error instanceof Error ? error.message : 'Failed to fetch available slots')
    } finally {
      setLoadingSlots(false)
    }
  }, [])
  
  // Fetch user bookings
  const fetchUserBookings = useCallback(async (status?: Booking['status']) => {
    if (!user) return
    
    setLoadingBookings(true)
    setErrorBookings(null)
    
    try {
      const bookings = await BookingService.getUserBookings(user.uid, status)
      setUserBookings(bookings)
    } catch (error) {
      setErrorBookings(error instanceof Error ? error.message : 'Failed to fetch user bookings')
    } finally {
      setLoadingBookings(false)
    }
  }, [user])
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!user) return
    
    setLoadingProfile(true)
    setErrorProfile(null)
    
    try {
      const profile = await BookingService.getUserProfile(user.uid)
      setUserProfile(profile)
    } catch (error) {
      setErrorProfile(error instanceof Error ? error.message : 'Failed to fetch user profile')
    } finally {
      setLoadingProfile(false)
    }
  }, [user])
  
  // Update user preferences
  const updateUserPreferences = useCallback(async (preferences: Partial<UserProfile['preferences']>) => {
    if (!user) return
    
    try {
      await BookingService.updateUserPreferences(user.uid, preferences)
      // Refresh user profile after update
      await fetchUserProfile()
    } catch (error) {
      setErrorProfile(error instanceof Error ? error.message : 'Failed to update preferences')
    }
  }, [user, fetchUserProfile])
  
  // Create booking
  const createBooking = useCallback(async (bookingData: any): Promise<string> => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const bookingId = await BookingService.createBooking({
        ...bookingData,
        userId: user.uid
      })
      
      // Refresh user bookings after creating new booking
      await fetchUserBookings()
      
      return bookingId
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create booking')
    }
  }, [user, fetchUserBookings])
  
  // Update booking status
  const updateBookingStatus = useCallback(async (bookingId: string, status: Booking['status']) => {
    try {
      await BookingService.updateBookingStatus(bookingId, status)
      // Refresh user bookings after status update
      await fetchUserBookings()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update booking status')
    }
  }, [fetchUserBookings])
  
  // Search tours
  const searchTours = useCallback(async (searchTerm: string): Promise<Tour[]> => {
    try {
      return await BookingService.searchTours(searchTerm)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search tours')
    }
  }, [])
  
  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      fetchTours()
      fetchUserBookings()
      fetchUserProfile()
    } else {
      // Clear data when user logs out
      setTours([])
      setUserBookings([])
      setUserProfile(null)
      setAvailableSlots([])
    }
  }, [user, fetchTours, fetchUserBookings, fetchUserProfile])
  
  return {
    // Tours
    tours,
    loadingTours,
    errorTours,
    fetchTours,
    
    // Available Slots
    availableSlots,
    loadingSlots,
    errorSlots,
    fetchAvailableSlots,
    
    // User Bookings
    userBookings,
    loadingBookings,
    errorBookings,
    fetchUserBookings,
    
    // User Profile
    userProfile,
    loadingProfile,
    errorProfile,
    fetchUserProfile,
    updateUserPreferences,
    
    // Actions
    createBooking,
    updateBookingStatus,
    searchTours,
    
    // Pagination
    hasMoreTours,
    loadMoreTours
  }
}
