#!/usr/bin/env node

import { seedDatabase } from '../lib/seed-data'

async function main() {
  try {
    console.log('🚀 Starting database seeding...')
    const result = await seedDatabase()
    console.log('✅ Database seeding completed!')
    console.log(`📊 Added ${result.toursAdded} tours and ${result.slotsAdded} available slots`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

main()
