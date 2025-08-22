"use client"

import { useState, useEffect } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  Auth
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseAvailable, setFirebaseAvailable] = useState(false)

  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      console.warn('Firebase auth is not available. Check your environment variables.')
      setLoading(false)
      setFirebaseAvailable(false)
      return
    }

    setFirebaseAvailable(true)
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
      
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    firebaseAvailable,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    isAuthenticated: !!user
  }
}
