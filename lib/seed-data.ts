import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { Tour, AvailableSlot } from './booking-service'

// Sample tour data with optimized structure for Firestore
const sampleTours: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    company: "Apple",
    location: "Apple Park, Cupertino",
    description: "Explore the iconic Apple Park campus and visitor center",
    highlights: ["Innovation Hub", "Campus Walk", "Visitor Center", "Apple Store"],
    rating: 4.9,
    duration: 180, // 3 hours in minutes
    price: 89,
    maxAttendees: 20,
    availableSlots: 15,
    image: "/images/apple-park.jpg",
    popular: true,
    trending: false,
    active: true
  },
  {
    company: "Google",
    location: "Googleplex, Mountain View",
    description: "Discover the colorful world of Google's headquarters",
    highlights: ["Android Lawn", "Campus Tour", "Innovation Labs", "Google Store"],
    rating: 4.8,
    duration: 150, // 2.5 hours in minutes
    price: 79,
    maxAttendees: 25,
    availableSlots: 20,
    image: "/images/google-campus.jpg",
    popular: true,
    trending: true,
    active: true
  },
  {
    company: "Meta",
    location: "Meta HQ, Menlo Park",
    description: "Step into the future of social connection and VR",
    highlights: ["VR Experience", "Campus Walk", "Innovation Center", "Photo Ops"],
    rating: 4.7,
    duration: 120, // 2 hours in minutes
    price: 69,
    maxAttendees: 20,
    availableSlots: 18,
    image: "/images/meta-campus.jpg",
    popular: false,
    trending: true,
    active: true
  },
  {
    company: "Tesla",
    location: "Tesla Factory, Fremont",
    description: "Witness the future of sustainable transportation",
    highlights: ["Factory Tour", "Model Showcase", "Supercharger Demo", "Innovation Talk"],
    rating: 4.8,
    duration: 210, // 3.5 hours in minutes
    price: 99,
    maxAttendees: 15,
    availableSlots: 12,
    image: "/images/tesla-factory.jpg",
    popular: true,
    trending: false,
    active: true
  },
  {
    company: "Netflix",
    location: "Netflix HQ, Los Gatos",
    description: "Go behind the scenes of the streaming revolution",
    highlights: ["Studio Tour", "Content Creation", "Tech Demo", "Exclusive Previews"],
    rating: 4.6,
    duration: 120, // 2 hours in minutes
    price: 75,
    maxAttendees: 15,
    availableSlots: 10,
    image: "/images/netflix-studios.jpg",
    popular: false,
    trending: false,
    active: true
  },
  {
    company: "Stanford",
    location: "Stanford University, Stanford",
    description: "Explore the innovation hub where tech giants were born",
    highlights: ["Campus Tour", "Innovation Labs", "Startup Culture", "Historical Sites"],
    rating: 4.7,
    duration: 150, // 2.5 hours in minutes
    price: 65,
    maxAttendees: 30,
    availableSlots: 25,
    image: "/images/stanford-university.jpg",
    popular: false,
    trending: true,
    active: true
  }
]

// Generate available slots for the next 30 days
function generateAvailableSlots(): Omit<AvailableSlot, 'id' | 'createdAt'>[] {
  const slots: Omit<AvailableSlot, 'id' | 'createdAt'>[] = []
  const today = new Date()
  
  // Generate slots for each tour for the next 30 days
  sampleTours.forEach((tour, tourIndex) => {
    for (let day = 0; day < 30; day++) {
      const date = new Date(today)
      date.setDate(today.getDate() + day)
      
      // Generate 2-3 time slots per day
      const timeSlots = ['09:00', '13:00', '16:00']
      
      timeSlots.forEach((time, timeIndex) => {
        // Skip some slots to create realistic availability
        if (Math.random() > 0.3) {
          slots.push({
            tourId: `tour_${tourIndex}`, // This will be replaced with actual tour ID
            date: Timestamp.fromDate(date),
            time,
            availableSpots: Math.floor(Math.random() * tour.maxAttendees) + 5,
            maxSpots: tour.maxAttendees,
            price: tour.price
          })
        }
      })
    }
  })
  
  return slots
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Add tours
    const tourIds: string[] = []
    for (const tour of sampleTours) {
      const tourRef = await addDoc(collection(db, 'tours'), {
        ...tour,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      tourIds.push(tourRef.id)
      console.log(`✅ Added tour: ${tour.company}`)
    }
    
    // Add available slots with correct tour IDs
    const availableSlots = generateAvailableSlots()
    let slotCount = 0
    
    for (let i = 0; i < availableSlots.length; i++) {
      const slot = availableSlots[i]
      const tourIndex = parseInt(slot.tourId.split('_')[1])
      
      await addDoc(collection(db, 'available_slots'), {
        ...slot,
        tourId: tourIds[tourIndex],
        createdAt: Timestamp.now()
      })
      slotCount++
    }
    
    console.log(`✅ Added ${slotCount} available slots`)
    console.log('🎉 Database seeding completed successfully!')
    
    return {
      toursAdded: tourIds.length,
      slotsAdded: slotCount
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Function to clear all data (for testing)
export async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...')
    
    // Note: In production, you'd want to implement proper deletion
    // This is a simplified version for development
    console.log('⚠️ Database clear function called - implement proper deletion in production')
    
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    throw error
  }
}
