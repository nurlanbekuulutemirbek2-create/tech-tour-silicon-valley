"use client"

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Helper function to extract first name from display name or email
const getFirstName = (user: any): string => {
  if (!user) return ""
  
  // If display name exists, extract first name
  if (user.displayName) {
    const firstName = user.displayName.split(' ')[0]
    return firstName || user.displayName
  }
  
  // If no display name, extract first part of email (before @)
  if (user.email) {
    const emailName = user.email.split('@')[0]
    // Remove numbers and special characters, then capitalize first letter
    const cleanName = emailName.replace(/[0-9]/g, '').replace(/[^a-zA-Z]/g, '')
    if (cleanName) {
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase()
    }
    // If no clean name, try to extract a reasonable first name
    const nameParts = emailName.split(/[0-9_]/)
    const firstName = nameParts[0] || emailName
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  
  return "User"
}

export function Header() {
  const { user, isAuthenticated, logout, loading } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
      router.push("/auth")
    } else {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group" title="Go to Homepage">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
            <span className="text-sm font-bold">TT</span>
          </div>
          <span className="font-serif text-xl font-bold group-hover:text-primary transition-colors">Tech Tour</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#tours" className="text-sm font-medium hover:text-primary transition-colors">
            Tours
          </a>
          <a href="#companies" className="text-sm font-medium hover:text-primary transition-colors">
            Companies
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
          <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
            Reviews
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Welcome, {getFirstName(user)}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
