'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string
  isPlaying: boolean
  volume: number
  isVisible?: boolean
  onError?: () => void
}

export default function YouTubePlayer({ 
  videoId, 
  isPlaying, 
  volume, 
  isVisible = false,
  onError
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = useState<any>(null)

  useEffect(() => {
    // Load the YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

    // Create the YouTube player
    const onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: isVisible ? '180' : '0',
        width: isVisible ? '320' : '0',
        videoId: videoId,
        playerVars: {
          controls: isVisible ? 1 : 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
            setPlayer(newPlayer)
          },
          onError: () => onError?.()
        }
      })
    }

    // Check if the API is already loaded
    if (window.YT) {
      onYouTubeIframeAPIReady()
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }
  }, [isVisible])

  useEffect(() => {
    if (player) {
      player.loadVideoById(videoId) // Load the new video when the videoId changes
    }
  }, [videoId, player])

  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo()
      } else {
        player.pauseVideo()
      }
    }
  }, [isPlaying, player])

  useEffect(() => {
    if (player) {
      player.setVolume(volume)
    }
  }, [volume, player])

  return (
    <div 
      ref={playerRef} 
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isVisible ? 'mb-4' : 'hidden'
      }`}
    />
  )
} 