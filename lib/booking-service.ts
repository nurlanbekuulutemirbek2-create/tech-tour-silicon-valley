import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

// Types for better type safety and data savings
export interface Tour {
  id: string
  company: string
  location: string
  description: string
  highlights: string[]
  rating: number
  duration: number // in minutes
  price: number
  maxAttendees: number
  availableSlots: number
  image: string
  popular: boolean
  trending: boolean
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Booking {
  id: string
  userId: string
  tourId: string
  tourName: string
  date: Timestamp
  time: string
  guestCount: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod: string
  specialRequests?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  preferences: {
    favoriteCompanies: string[]
    preferredDates: string[]
    maxPrice: number
  }
  bookingHistory: string[] // booking IDs
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AvailableSlot {
  id: string
  tourId: string
  date: Timestamp
  time: string
  availableSpots: number
  maxSpots: number
  price: number
  createdAt: Timestamp
}

// Collection names for consistency and easy maintenance
const COLLECTIONS = {
  TOURS: 'tours',
  BOOKINGS: 'bookings',
  USERS: 'users',
  SLOTS: 'available_slots',
  REVIEWS: 'reviews'
} as const

export class BookingService {
  // Tour Management with efficient queries
  static async getTours(filters?: {
    company?: string
    active?: boolean
    popular?: boolean
    maxPrice?: number
  }): Promise<Tour[]> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      console.log('🔍 Fetching tours with filters:', filters)
      
      const constraints: QueryConstraint[] = []
      
      // Add filters for efficient querying
      if (filters?.active !== undefined) {
        constraints.push(where('active', '==', filters.active))
      }
      if (filters?.company) {
        constraints.push(where('company', '==', filters.company))
      }
      if (filters?.popular) {
        constraints.push(where('popular', '==', true))
      }
      if (filters?.maxPrice) {
        constraints.push(where('price', '<=', filters.maxPrice))
      }
      
      // Order by popularity and rating for better UX
      constraints.push(orderBy('popular', 'desc'))
      constraints.push(orderBy('rating', 'desc'))
      
      const toursQuery = query(collection(db, COLLECTIONS.TOURS), ...constraints)
      const snapshot = await getDocs(toursQuery)
      
      const tours = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tour[]
      
      console.log(`✅ Found ${tours.length} tours`)
      return tours
    } catch (error: any) {
      // Handle index errors gracefully
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Index not ready, falling back to simple query:', error.message)
        
        // Fallback to simple query without complex ordering
        try {
          const simpleConstraints: QueryConstraint[] = []
          
          if (filters?.active !== undefined) {
            simpleConstraints.push(where('active', '==', filters.active))
          }
          
          const simpleQuery = query(collection(db, COLLECTIONS.TOURS), ...simpleConstraints)
          const snapshot = await getDocs(simpleQuery)
          
          let tours = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Tour[]
          
          console.log(`✅ Fallback query found ${tours.length} tours`)
          
          // Apply additional filters client-side
          if (filters?.company) {
            tours = tours.filter(tour => tour.company === filters.company)
          }
          if (filters?.popular) {
            tours = tours.filter(tour => tour.popular === true)
          }
          if (filters?.maxPrice) {
            tours = tours.filter(tour => tour.price <= filters.maxPrice!)
          }
          
          // Sort client-side
          tours.sort((a, b) => {
            if (a.popular !== b.popular) {
              return b.popular ? 1 : -1
            }
            return b.rating - a.rating
          })
          
          return tours
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError)
          throw new Error('Failed to fetch tours. Please try again later.')
        }
      }
      
      console.error('Error fetching tours:', error)
      throw new Error('Failed to fetch tours')
    }
  }

  // Get unique tours by company (one tour per company)
  static async getUniqueToursByCompany(filters?: {
    active?: boolean
    popular?: boolean
    maxPrice?: number
  }): Promise<Tour[]> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      console.log('🔍 Fetching unique tours by company with filters:', filters)
      
      // Use a simpler approach - get all tours and filter client-side
      const toursQuery = query(collection(db, COLLECTIONS.TOURS))
      const snapshot = await getDocs(toursQuery)
      
      let allTours = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tour[]
      
      console.log('🔍 All tours fetched:', allTours.map(t => ({ company: t.company, id: t.id })))
      
      // Apply filters
      if (filters?.active !== undefined) {
        allTours = allTours.filter(tour => tour.active === filters.active)
      }
      if (filters?.popular) {
        allTours = allTours.filter(tour => tour.popular === true)
      }
      if (filters?.maxPrice) {
        allTours = allTours.filter(tour => tour.price <= filters.maxPrice!)
      }
      
      console.log('🔍 Tours after filtering:', allTours.map(t => ({ company: t.company, id: t.id })))
      
      // Create a Map to ensure only one tour per company (keeps the first one encountered)
      const uniqueToursMap = new Map<string, Tour>()
      
      allTours.forEach(tour => {
        if (!uniqueToursMap.has(tour.company)) {
          uniqueToursMap.set(tour.company, tour)
          console.log(`✅ Added unique tour for ${tour.company}`)
        } else {
          console.log(`⚠️ Skipping duplicate tour for ${tour.company} (keeping: ${uniqueToursMap.get(tour.company)?.id}, skipping: ${tour.id})`)
        }
      })
      
      const uniqueTours = Array.from(uniqueToursMap.values())
      
      // Sort by popularity and rating
      uniqueTours.sort((a, b) => {
        if (a.popular !== b.popular) {
          return b.popular ? 1 : -1
        }
        return b.rating - a.rating
      })
      
      console.log(`✅ Found ${uniqueTours.length} unique tours by company:`, uniqueTours.map(t => t.company))
      return uniqueTours
    } catch (error: any) {
      console.error('Error fetching unique tours by company:', error)
      throw new Error('Failed to fetch tours')
    }
  }

  static async getTourById(tourId: string): Promise<Tour | null> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      const tourDoc = await getDoc(doc(db, COLLECTIONS.TOURS, tourId))
      if (tourDoc.exists()) {
        return { id: tourDoc.id, ...tourDoc.data() } as Tour
      }
      return null
    } catch (error) {
      console.error('Error fetching tour:', error)
      throw new Error('Failed to fetch tour')
    }
  }

  // Available Slots with date-based indexing
  static async getAvailableSlots(tourId: string, startDate: Date, endDate: Date): Promise<AvailableSlot[]> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    // Create timestamps once for use in all queries
    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    try {
      console.log('🔍 Fetching available slots for tour:', tourId, 'from:', startDate, 'to:', endDate)
      
      const slotsQuery = query(
        collection(db, COLLECTIONS.SLOTS),
        where('tourId', '==', tourId),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        where('availableSpots', '>', 0),
        orderBy('date', 'asc'),
        orderBy('time', 'asc')
      )
      
      const snapshot = await getDocs(slotsQuery)
      const slots = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AvailableSlot[]
      
      console.log(`✅ Found ${slots.length} available slots for tour ${tourId}`)
      return slots
    } catch (error: any) {
      console.error('❌ Error fetching available slots:', error)
      
      // Handle index building errors gracefully
      if (error.code === 'failed-precondition' || 
          error.message.includes('index') || 
          error.message.includes('building')) {
        
        console.warn('⚠️ Index is building, falling back to simple query:', error.message)
        
        // Fallback to simple query without complex ordering
        try {
          console.log('🔄 Attempting fallback query for available slots...')
          
          const simpleQuery = query(
            collection(db, COLLECTIONS.SLOTS),
            where('tourId', '==', tourId),
            where('availableSpots', '>', 0)
          )
          
          const snapshot = await getDocs(simpleQuery)
          let slots = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AvailableSlot[]
          
          // Filter by date range client-side
          slots = slots.filter(slot => {
            const slotDate = slot.date
            return slotDate >= startTimestamp && slotDate <= endTimestamp
          })
          
          // Sort client-side
          slots.sort((a, b) => {
            if (a.date.toMillis() !== b.date.toMillis()) {
              return a.date.toMillis() - b.date.toMillis()
            }
            return a.time.localeCompare(b.time)
          })
          
          console.log(`✅ Fallback query successful! Found ${slots.length} available slots for tour ${tourId}`)
          return slots
        } catch (fallbackError: any) {
          console.error('❌ Fallback query also failed:', fallbackError)
          
          // If fallback also fails due to building index, try even simpler query
          if (fallbackError.message.includes('building') || fallbackError.message.includes('index')) {
            console.log('🔄 Attempting ultra-simple fallback query...')
            
            try {
              const ultraSimpleQuery = query(
                collection(db, COLLECTIONS.SLOTS),
                where('tourId', '==', tourId)
              )
              
              const snapshot = await getDocs(ultraSimpleQuery)
              let slots = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as AvailableSlot[]
              
              // Filter everything client-side
              slots = slots.filter(slot => {
                const slotDate = slot.date
                return slotDate >= startTimestamp && 
                       slotDate <= endTimestamp && 
                       slot.availableSpots > 0
              })
              
              // Sort client-side
              slots.sort((a, b) => {
                if (a.date.toMillis() !== b.date.toMillis()) {
                  return a.date.toMillis() - b.date.toMillis()
                }
                return a.time.localeCompare(b.time)
              })
              
              console.log(`✅ Ultra-simple fallback successful! Found ${slots.length} available slots for tour ${tourId}`)
              return slots
            } catch (ultraError) {
              console.error('❌ Ultra-simple fallback also failed:', ultraError)
              console.log('📝 Returning empty slots array - indexes are still building')
              return []
            }
          }
          
          // Return empty array instead of throwing error
          console.log('📝 Returning empty slots array due to index issues')
          return []
        }
      }
      
      // For other errors, return empty array instead of throwing
      console.log('📝 Returning empty slots array due to error')
      return []
    }
  }

  // Booking Management with batch operations for data consistency
  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      const batch = writeBatch(db)
      
      // Create booking
      const bookingRef = doc(collection(db, COLLECTIONS.BOOKINGS))
      const booking: Omit<Booking, 'id'> = {
        ...bookingData,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      }
      batch.set(bookingRef, booking)
      
      // Update available slots
      const slotRef = doc(db, COLLECTIONS.SLOTS, bookingData.tourId)
      batch.update(slotRef, {
        availableSpots: bookingData.guestCount,
        updatedAt: serverTimestamp()
      })
      
      // Update user profile with booking history
      const userRef = doc(db, COLLECTIONS.USERS, bookingData.userId)
      batch.update(userRef, {
        bookingHistory: bookingRef.id,
        updatedAt: serverTimestamp()
      })
      
      await batch.commit()
      return bookingRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Failed to create booking')
    }
  }

  static async getUserBookings(userId: string, status?: Booking['status']): Promise<Booking[]> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      console.log('🔍 Fetching user bookings for:', userId, 'status:', status)
      
      const constraints: QueryConstraint[] = [where('userId', '==', userId)]
      
      if (status) {
        constraints.push(where('status', '==', status))
      }
      
      constraints.push(orderBy('createdAt', 'desc'))
      
      const bookingsQuery = query(collection(db, COLLECTIONS.BOOKINGS), ...constraints)
      const snapshot = await getDocs(bookingsQuery)
      
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[]
      
      console.log(`✅ Found ${bookings.length} bookings for user`)
      return bookings
    } catch (error: any) {
      // Handle index errors gracefully
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Index not ready for user bookings, falling back to simple query:', error.message)
        
        // Fallback to simple query without ordering
        try {
          const simpleConstraints: QueryConstraint[] = [where('userId', '==', userId)]
          
          if (status) {
            simpleConstraints.push(where('status', '==', status))
          }
          
          const simpleQuery = query(collection(db, COLLECTIONS.BOOKINGS), ...simpleConstraints)
          const snapshot = await getDocs(simpleQuery)
          
          let bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[]
          
          // Sort client-side
          bookings.sort((a, b) => {
            return b.createdAt.toMillis() - a.createdAt.toMillis()
          })
          
          console.log(`✅ Fallback query found ${bookings.length} bookings for user`)
          return bookings
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError)
          // Return empty array instead of throwing error
          console.log('Returning empty bookings array due to index issues')
          return []
        }
      }
      
      console.error('Error fetching user bookings:', error)
      // Return empty array instead of throwing error to prevent UI crashes
      return []
    }
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      await updateDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId), {
        status,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw new Error('Failed to update booking status')
    }
  }

  // User Profile Management
  static async createUserProfile(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw new Error('Failed to create user profile')
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
        preferences: preferences,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw new Error('Failed to update user preferences')
    }
  }

  // Pagination for large datasets
  static async getToursPaginated(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ tours: Tour[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      const constraints: QueryConstraint[] = [
        where('active', '==', true),
        orderBy('rating', 'desc'),
        limit(pageSize)
      ]
      
      if (lastDoc) {
        constraints.push(startAfter(lastDoc))
      }
      
      const toursQuery = query(collection(db, COLLECTIONS.TOURS), ...constraints)
      const snapshot = await getDocs(toursQuery)
      
      const tours = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tour[]
      
      const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null
      
      return { tours, lastDoc: lastVisible }
    } catch (error) {
      console.error('Error fetching paginated tours:', error)
      throw new Error('Failed to fetch tours')
    }
  }

  // Search functionality with text indexing
  static async searchTours(searchTerm: string): Promise<Tour[]> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      // Note: For production, consider using Algolia or similar for full-text search
      // This is a simple implementation using Firestore queries
      const toursQuery = query(
        collection(db, COLLECTIONS.TOURS),
        where('active', '==', true),
        orderBy('company'),
        orderBy('rating', 'desc')
      )
      
      const snapshot = await getDocs(toursQuery)
      const tours = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tour[]
      
      // Client-side filtering for search term
      return tours.filter(tour => 
        tour.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.highlights.some(highlight => 
          highlight.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } catch (error) {
      console.error('Error searching tours:', error)
      throw new Error('Failed to search tours')
    }
  }

  // Analytics and reporting queries
  static async getBookingStats(startDate: Date, endDate: Date): Promise<{
    totalBookings: number
    totalRevenue: number
    averageRating: number
    popularTours: string[]
  }> {
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    try {
      const startTimestamp = Timestamp.fromDate(startDate)
      const endTimestamp = Timestamp.fromDate(endDate)
      
      const bookingsQuery = query(
        collection(db, COLLECTIONS.BOOKINGS),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp),
        where('status', '==', 'confirmed')
      )
      
      const snapshot = await getDocs(bookingsQuery)
      const bookings = snapshot.docs.map(doc => doc.data()) as Booking[]
      
      const totalBookings = bookings.length
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      
      // Calculate popular tours
      const tourCounts: { [key: string]: number } = {}
      bookings.forEach(booking => {
        tourCounts[booking.tourName] = (tourCounts[booking.tourName] || 0) + 1
      })
      
      const popularTours = Object.entries(tourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tourName]) => tourName)
      
      return {
        totalBookings,
        totalRevenue,
        averageRating: 4.8, // This would come from reviews collection
        popularTours
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      throw new Error('Failed to fetch booking statistics')
    }
  }
}
