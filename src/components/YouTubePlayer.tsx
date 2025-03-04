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

    console.log('isVisible', isVisible);
    console.log('Video ID', videoId);

    // Create the YouTube player
    const onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return;
      
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '180',
        width: '320',
        videoId: videoId,
        playerVars: {
          controls: 1,
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
  }, [])

  useEffect(() => {
    if (player) {
      console.log('isVisible', isVisible);
      console.log('Video ID', videoId);
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
      className={`rounded-xl overflow-hidden transition-all duration-300 mb-4`}
    />
  )
} 