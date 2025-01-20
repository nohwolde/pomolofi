'use client'

import { useEffect, useRef, useState } from 'react'

type YouTubePlayerProps = {
  videoId: string
  isPlaying: boolean
  volume: number
}

export default function YouTubePlayer({ videoId, isPlaying, volume }: YouTubePlayerProps) {
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
        height: '0', // Hide the player
        width: '0',  // Hide the player
        videoId: videoId,
        playerVars: {
        //   autoplay: 1,
          controls: 0, // Hide default controls
          loop: 1,
          playlist: videoId // Loop the same video
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
            setPlayer(newPlayer)
          }
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

  return <div ref={playerRef} style={{ display: 'none' }} /> // Hide the player
} 