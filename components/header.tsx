"use client"

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const { user, isAuthenticated, logout } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
      router.push("/")
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
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">TT</span>
          </div>
          <span className="font-serif text-xl font-bold">Tech Tour</span>
        </div>

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
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.displayName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
