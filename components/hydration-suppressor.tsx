"use client"

import { useEffect, useState } from "react"

interface HydrationSuppressorProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HydrationSuppressor({ 
  children, 
  fallback = null 
}: HydrationSuppressorProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Show fallback during SSR and initial hydration
  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook to detect if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

// Component for elements that should only render on client
export function ClientOnly({ 
  children, 
  fallback = null 
}: HydrationSuppressorProps) {
  const isClient = useIsClient()

  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
