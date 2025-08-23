"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { YouTubeEmbed } from "./youtube-embed"

interface VideoPreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoPreviewModal({ isOpen, onClose }: VideoPreviewModalProps) {
  const handleVideoPlay = () => {
    console.log('Video started playing')
  }

  const handleVideoPause = () => {
    console.log('Video paused')
  }

  const handleVideoEnded = () => {
    console.log('Video ended')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-black">
        <DialogHeader className="absolute top-6 left-6 z-10">
          <DialogTitle className="text-white text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bay Area Tech Tour Video
          </DialogTitle>
        </DialogHeader>
        
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 backdrop-blur-sm bg-white/10 rounded-xl w-10 h-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

                <YouTubeEmbed 
          videoId="LPA8VnDSObY"
          title="Bay Area Tech Tour Preview"
        />
      </DialogContent>
    </Dialog>
  )
}
