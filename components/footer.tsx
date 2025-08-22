import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">TT</span>
              </div>
              <span className="font-serif text-xl font-bold">Tech Tour</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover Silicon Valley's most innovative companies through exclusive guided tours.
            </p>
            <Badge variant="secondary">🌟 Trusted by 2,500+ visitors</Badge>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#tours" className="text-muted-foreground hover:text-primary transition-colors">
                Browse Tours
              </a>
              <a href="#companies" className="text-muted-foreground hover:text-primary transition-colors">
                Featured Companies
              </a>
              <a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">
                Reviews
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Booking Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cancellation
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@techtour.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule a Call
            </Button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Tech Tour. All rights reserved. Built with ❤️ for tech enthusiasts.</p>
        </div>
      </div>
    </footer>
  )
}
