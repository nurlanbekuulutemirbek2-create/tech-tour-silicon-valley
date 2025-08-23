"use client"

import { SeedDatabase } from "@/components/debug/seed-database"
import { SelectTourStep } from "@/components/booking/select-tour-step"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Database Management</h2>
            <SeedDatabase />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Tour Selection Test</h2>
            <div className="bg-white rounded-lg p-6">
              <SelectTourStep
                onNext={() => console.log('Next clicked')}
                onDataUpdate={(data) => console.log('Data updated:', data)}
                data={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
