#!/usr/bin/env node

import { reseedDatabaseWithUniqueTours } from '../lib/seed-data'

async function main() {
  try {
    console.log('🚀 Starting database fix for duplicate tours...')
    const result = await reseedDatabaseWithUniqueTours()
    console.log('✅ Database fixed successfully!')
    console.log(`📊 Added ${result.toursAdded} unique tours and ${result.slotsAdded} available slots`)
    console.log('🎉 Now each company should have only one tour in the select tour step!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database fix failed:', error)
    process.exit(1)
  }
}

main()
