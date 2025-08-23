"use client"

import { useState } from "react"

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export function YouTubeEmbed({ videoId, title = "Tech Tour Preview" }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '1s' }}></div>
            </div>
            <p className="text-white text-lg font-medium">Loading Tech Tour Video...</p>
            <p className="text-gray-400 text-sm mt-2">Experience Silicon Valley's finest</p>
          </div>
        </div>
      )}
      
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={() => {
          // Fallback to opening in new tab if embed fails
          window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
        }}
      />
    </div>
  )
}
