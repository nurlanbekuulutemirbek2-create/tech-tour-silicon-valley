"use client"

import { useEffect, useState } from "react"

/**
 * Hook to detect if the component is mounted on the client
 * Useful for preventing hydration mismatches
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

/**
 * Hook to safely access window object
 * Returns undefined during SSR to prevent hydration mismatches
 */
export function useWindow() {
  const [windowObj, setWindowObj] = useState<Window | undefined>(undefined)

  useEffect(() => {
    setWindowObj(window)
  }, [])

  return windowObj
}

/**
 * Hook to safely access document object
 * Returns undefined during SSR to prevent hydration mismatches
 */
export function useDocument() {
  const [documentObj, setDocumentObj] = useState<Document | undefined>(undefined)

  useEffect(() => {
    setDocumentObj(document)
  }, [])

  return documentObj
}

/**
 * Component that only renders children after hydration
 * Useful for components that depend on browser APIs
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Utility to remove browser extension attributes that cause hydration mismatches
 */
export function removeExtensionAttributes() {
  if (typeof window === "undefined") return

  const body = document.body
  if (body) {
    // Remove Grammarly attributes
    body.removeAttribute('data-new-gr-c-s-check-loaded')
    body.removeAttribute('data-gr-ext-installed')
    
    // Remove other common extension attributes
    body.removeAttribute('data-gramm')
    body.removeAttribute('data-gramm_editor')
    body.removeAttribute('data-gramm_id')
    
    // Remove other potential extension attributes
    body.removeAttribute('data-grammarly-shadow-root')
    body.removeAttribute('data-grammarly-shadow-root-version')
  }
}

/**
 * Hook to automatically remove extension attributes on mount
 */
export function useRemoveExtensionAttributes() {
  useEffect(() => {
    removeExtensionAttributes()
    
    // Also run after a short delay to catch any late additions
    const timeoutId = setTimeout(removeExtensionAttributes, 100)
    
    // And run on DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target === document.body) {
          removeExtensionAttributes()
        }
      })
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [
        'data-new-gr-c-s-check-loaded', 
        'data-gr-ext-installed', 
        'data-gramm', 
        'data-gramm_editor', 
        'data-gramm_id',
        'data-grammarly-shadow-root',
        'data-grammarly-shadow-root-version'
      ]
    })
    
    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])
}
