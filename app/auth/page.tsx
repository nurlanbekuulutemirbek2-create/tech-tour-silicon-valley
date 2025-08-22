"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AuthCard } from "@/components/auth/auth-card"
import { useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { toast } = useToast()
  const { signIn, signUp, signInWithGoogle, signInWithApple, firebaseAvailable, loading: authLoading } = useAuthContext()
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseAvailable) {
      toast({
        title: "Firebase not configured",
        description: "Please check your environment variables and restart the server.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "You have been signed in successfully.",
        })
        router.push("/") // Redirect to home page
      } else {
        toast({
          title: "Sign in failed",
          description: result.error || "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseAvailable) {
      toast({
        title: "Firebase not configured",
        description: "Please check your environment variables and restart the server.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp(email, password)
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
        })
        router.push("/") // Redirect to home page
      } else {
        toast({
          title: "Sign up failed",
          description: result.error || "Please check your information and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!firebaseAvailable) {
      toast({
        title: "Firebase not configured",
        description: "Please check your environment variables and restart the server.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "You have been signed in with Google successfully.",
        })
        router.push("/") // Redirect to home page
      } else {
        toast({
          title: "Google sign in failed",
          description: result.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    if (!firebaseAvailable) {
      toast({
        title: "Firebase not configured",
        description: "Please check your environment variables and restart the server.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await signInWithApple()
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "You have been signed in with Apple successfully.",
        })
        router.push("/") // Redirect to home page
      } else {
        toast({
          title: "Apple sign in failed",
          description: result.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: "Reset link sent",
      description: "Check your email for password reset instructions.",
    })
  }

  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-green-900">
          {/* Apple-inspired minimal precision - glass-like cards with darker tones */}
          <div className="absolute top-20 left-20 w-40 h-32 bg-gradient-to-br from-emerald-900/40 to-green-800/30 rounded-3xl backdrop-blur-sm border border-emerald-700/20 opacity-80"></div>
          <div className="absolute top-40 right-32 w-28 h-28 bg-gradient-to-br from-emerald-800/60 to-green-700/40 rounded-2xl backdrop-blur-sm border border-emerald-600/30 opacity-70"></div>

          {/* Google-inspired playful innovation with darker tech colors */}
          <div className="absolute top-32 left-1/3 w-20 h-20 bg-gradient-to-br from-blue-600/70 to-blue-700/50 rounded-full backdrop-blur-sm opacity-60 animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-emerald-600/60 to-green-700/40 rounded-lg backdrop-blur-sm opacity-50 rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-br from-teal-600/70 to-cyan-700/50 rounded-full backdrop-blur-sm opacity-70 animate-pulse delay-500"></div>

          {/* Meta-inspired futuristic connectedness with darker AI code lines */}
          <div className="absolute top-1/4 left-1/2 w-10 h-10 bg-gradient-to-br from-emerald-700/60 to-green-800/40 rounded-full backdrop-blur-sm opacity-60 animate-pulse delay-300"></div>
          <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-gradient-to-br from-teal-600/70 to-emerald-700/50 rounded-full backdrop-blur-sm opacity-50 transform translate-x-20 translate-y-10 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-br from-green-800/60 to-emerald-900/40 rounded-full backdrop-blur-sm opacity-40 transform -translate-x-16 translate-y-16 animate-pulse delay-1200"></div>

          {/* AI-inspired connecting lines with darker gradients */}
          <svg className="absolute top-1/4 left-1/2 w-40 h-40 opacity-30">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <line x1="20" y1="20" x2="100" y2="50" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="20" y1="20" x2="24" y2="100" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;10" dur="2.5s" repeatCount="indefinite" />
            </line>
            <line x1="100" y1="50" x2="24" y2="100" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
            </line>
          </svg>

          {/* Glass-like floating elements with darker blur effects */}
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-emerald-800/20 to-green-900/10 rounded-full backdrop-blur-xl border border-emerald-700/10 opacity-40"></div>
          <div className="absolute top-10 right-1/4 w-36 h-36 bg-gradient-to-br from-teal-800/30 to-emerald-900/20 rounded-full backdrop-blur-lg border border-emerald-700/20 opacity-50"></div>

          {/* Interactive tech accent dots with darker tones */}
          <div className="absolute top-3/4 left-10 w-4 h-4 bg-emerald-400/80 rounded-full backdrop-blur-sm animate-ping"></div>
          <div className="absolute top-1/6 left-3/4 w-3 h-3 bg-teal-400/70 rounded-full backdrop-blur-sm animate-ping delay-500"></div>
          <div className="absolute bottom-1/4 right-10 w-4 h-4 bg-green-400/60 rounded-full backdrop-blur-sm animate-ping delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-3 h-3 bg-cyan-400/80 rounded-full backdrop-blur-sm animate-ping delay-1500"></div>

          {/* Animated Bay Area tech company labels */}
          <div className="absolute top-1/4 left-1/6 text-emerald-300/40 font-bold text-6xl transform -rotate-12 select-none">
            <div className="animate-pulse" style={{ animationDuration: "4s", animationDelay: "0s" }}>
              Apple Park
            </div>
          </div>

          <div className="absolute top-1/2 right-1/5 text-blue-400/35 font-bold text-5xl transform rotate-6 select-none">
            <div className="animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }}>
              Google
            </div>
          </div>

          <div className="absolute bottom-1/3 left-1/4 text-cyan-400/40 font-bold text-4xl transform rotate-3 select-none">
            <div className="animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}>
              Meta
            </div>
          </div>

          <div className="absolute top-2/3 right-1/3 text-teal-300/35 font-bold text-5xl transform -rotate-8 select-none">
            <div className="animate-pulse" style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}>
              Stanford
            </div>
          </div>
        </div>

        <AuthCard
          isLoading={isLoading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          onForgotPassword={handleForgotPassword}
        />
        <Toaster />
      </div>
    </AuthGuard>
  )
}
