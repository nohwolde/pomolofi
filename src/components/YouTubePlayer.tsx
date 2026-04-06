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
  playlistId?: string
  isPlaying: boolean
  volume: number
  isVisible?: boolean
  onError?: () => void
}

export default function YouTubePlayer({ 
  videoId, 
  playlistId,
  isPlaying, 
  volume, 
  isVisible = false,
  onError
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = useState<any>(null)
  const prevPlaylistId = useRef(playlistId)
  const prevVideoId = useRef(videoId)

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

    const onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return;

      const playerVars: Record<string, any> = {
        controls: 1,
        modestbranding: 1,
        rel: 0,
      }

      if (playlistId) {
        playerVars.listType = 'playlist'
        playerVars.list = playlistId
      } else {
        playerVars.loop = 1
        playerVars.playlist = videoId
      }
      
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '180',
        width: '320',
        videoId: playlistId ? undefined : videoId,
        playerVars,
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
            setPlayer(newPlayer)
          },
          onError: () => onError?.()
        }
      })
    }

    if (window.YT) {
      onYouTubeIframeAPIReady()
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }
  }, [])

  useEffect(() => {
    if (!player) return

    if (playlistId && playlistId !== prevPlaylistId.current) {
      player.loadPlaylist({ listType: 'playlist', list: playlistId })
      prevPlaylistId.current = playlistId
      prevVideoId.current = videoId
    } else if (!playlistId && videoId !== prevVideoId.current) {
      player.loadVideoById(videoId)
      prevVideoId.current = videoId
      prevPlaylistId.current = undefined
    }
  }, [videoId, playlistId, player])

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
