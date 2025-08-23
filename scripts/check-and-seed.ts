#!/usr/bin/env node

import { getDocs, collection } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { seedDatabase } from '../lib/seed-data'

async function checkAndSeedDatabase() {
  try {
    console.log('🔍 Checking database for existing data...')
    
    if (!db) {
      console.error('❌ Firestore is not initialized')
      process.exit(1)
    }

    // Check if tours collection has data
    const toursSnapshot = await getDocs(collection(db, 'tours'))
    const toursCount = toursSnapshot.size

    console.log(`📊 Found ${toursCount} tours in database`)

    if (toursCount === 0) {
      console.log('🌱 No tours found. Seeding database...')
      const result = await seedDatabase()
      console.log('✅ Database seeded successfully!')
      console.log(`📊 Added ${result.toursAdded} tours and ${result.slotsAdded} available slots`)
    } else {
      console.log('✅ Database already has data. No seeding needed.')
    }

    // Check available slots
    const slotsSnapshot = await getDocs(collection(db, 'available_slots'))
    console.log(`📅 Found ${slotsSnapshot.size} available slots`)

    // Check bookings
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
    console.log(`📋 Found ${bookingsSnapshot.size} bookings`)

    console.log('🎉 Database check completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error checking database:', error)
    process.exit(1)
  }
}

checkAndSeedDatabase()
