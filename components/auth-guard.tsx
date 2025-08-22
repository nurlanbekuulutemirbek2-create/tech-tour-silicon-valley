"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/auth-context'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: AuthGuardProps) {
  const { user, loading, firebaseAvailable } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return

    // If Firebase is not available, allow access (for development)
    if (!firebaseAvailable) {
      console.warn('Firebase not available, allowing access for development')
      return
    }

    // If auth is required and user is not authenticated, redirect to auth page
    if (requireAuth && !user) {
      router.push(redirectTo)
      return
    }

    // If auth is not required and user is authenticated, redirect to home
    if (!requireAuth && user) {
      router.push('/')
      return
    }
  }, [user, loading, requireAuth, redirectTo, router, firebaseAvailable])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If Firebase is not available, show a message
  if (!firebaseAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Firebase Not Configured</h2>
          <p className="text-muted-foreground mb-4">
            Please check your environment variables and restart the server.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If auth is required and user is not authenticated, show nothing (will redirect)
  if (requireAuth && !user) {
    return null
  }

  // If auth is not required and user is authenticated, show nothing (will redirect)
  if (!requireAuth && user) {
    return null
  }

  // Show children if authentication requirements are met
  return <>{children}</>
}
