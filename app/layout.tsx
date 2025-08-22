import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { HydrationSuppressor } from "@/components/hydration-suppressor"
import { AuthProvider } from "@/contexts/auth-context"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Tech Tour - Silicon Valley & San Francisco Experience",
  description:
    "Book immersive tours of Silicon Valley's most iconic tech companies including Apple, Google, Meta, Netflix, and Tesla.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <HydrationSuppressor>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Remove browser extension attributes that cause hydration mismatches
                (function() {
                  function removeExtensionAttributes() {
                    const body = document.body;
                    if (body) {
                      // Remove Grammarly attributes
                      body.removeAttribute('data-new-gr-c-s-check-loaded');
                      body.removeAttribute('data-gr-ext-installed');
                      
                      // Remove other common extension attributes
                      body.removeAttribute('data-gramm');
                      body.removeAttribute('data-gramm_editor');
                      body.removeAttribute('data-gramm_id');
                    }
                  }
                  
                  // Run immediately
                  removeExtensionAttributes();
                  
                  // Also run after a short delay to catch any late additions
                  setTimeout(removeExtensionAttributes, 100);
                  
                  // And run on DOM changes
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.target === document.body) {
                        removeExtensionAttributes();
                      }
                    });
                  });
                  
                  observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'data-gramm', 'data-gramm_editor', 'data-gramm_id']
                  });
                })();
              `,
            }}
          />
        </HydrationSuppressor>
      </body>
    </html>
  )
}
