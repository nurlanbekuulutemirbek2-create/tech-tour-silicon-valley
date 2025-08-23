"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { seedDatabase } from "@/lib/seed-data"
import { getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function SeedDatabase() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [stats, setStats] = useState<{
    tours: number
    slots: number
    bookings: number
  } | null>(null)
  const [message, setMessage] = useState("")

  const checkDatabase = async () => {
    if (!db) {
      setMessage("❌ Firestore is not initialized")
      return
    }

    setIsChecking(true)
    setMessage("🔍 Checking database...")

    try {
      const toursSnapshot = await getDocs(collection(db, 'tours'))
      const slotsSnapshot = await getDocs(collection(db, 'available_slots'))
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'))

      const stats = {
        tours: toursSnapshot.size,
        slots: slotsSnapshot.size,
        bookings: bookingsSnapshot.size
      }

      setStats(stats)
      setMessage(`✅ Database check completed! Found ${stats.tours} tours, ${stats.slots} slots, ${stats.bookings} bookings`)
    } catch (error) {
      setMessage(`❌ Error checking database: ${error}`)
    } finally {
      setIsChecking(false)
    }
  }

  const seedDatabaseData = async () => {
    if (!db) {
      setMessage("❌ Firestore is not initialized")
      return
    }

    setIsSeeding(true)
    setMessage("🌱 Seeding database...")

    try {
      const result = await seedDatabase()
      setMessage(`✅ Database seeded successfully! Added ${result.toursAdded} tours and ${result.slotsAdded} slots`)
      
      // Refresh stats
      await checkDatabase()
    } catch (error) {
      setMessage(`❌ Error seeding database: ${error}`)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Database Debug</h3>
      
      <div className="space-y-4">
        <Button 
          onClick={checkDatabase} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? "Checking..." : "Check Database"}
        </Button>

        <Button 
          onClick={seedDatabaseData} 
          disabled={isSeeding}
          variant="outline"
          className="w-full"
        >
          {isSeeding ? "Seeding..." : "Seed Database"}
        </Button>

        {message && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            {message}
          </div>
        )}

        {stats && (
          <div className="space-y-2 text-sm">
            <div>📊 Tours: {stats.tours}</div>
            <div>📅 Slots: {stats.slots}</div>
            <div>📋 Bookings: {stats.bookings}</div>
          </div>
        )}
      </div>
    </Card>
  )
}
