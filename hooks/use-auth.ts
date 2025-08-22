"use client"

import { useState, useEffect } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  Auth
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups and try again.'
    default:
      return 'An error occurred. Please try again.'
  }
}

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
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
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
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
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
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
    }
  }

  const signInWithApple = async () => {
    if (!auth || !firebaseAvailable) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please check your environment variables.' 
      }
    }

    try {
      const provider = new OAuthProvider('apple.com')
      const result = await signInWithPopup(auth, provider)
      return { success: true, user: result.user }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
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
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
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
      const errorMessage = getErrorMessage(error.code)
      return { success: false, error: errorMessage }
    }
  }

  return {
    user,
    loading,
    firebaseAvailable,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    logout,
    resetPassword,
    isAuthenticated: !!user
  }
}
