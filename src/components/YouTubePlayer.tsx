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
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const prevVideoId = useRef(videoId)

  useEffect(() => {
    let destroyed = false
    let ytPlayer: any = null

    const initPlayer = () => {
      if (destroyed || !containerRef.current) return

      // Create a child element for YouTube to replace with its iframe.
      // This keeps the React-managed container intact during unmount.
      const el = document.createElement('div')
      containerRef.current.appendChild(el)

      const playerVars: Record<string, any> = {
        controls: 1,
        modestbranding: 1,
        rel: 0,
        autoplay: 1,
      }

      if (playlistId) {
        playerVars.listType = 'playlist'
        playerVars.list = playlistId
      } else {
        playerVars.loop = 1
        playerVars.playlist = videoId
      }

      const config: Record<string, any> = {
        height: '180',
        width: '320',
        playerVars,
        events: {
          onReady: (event: any) => {
            if (destroyed) return
            event.target.setVolume(volume)
            event.target.playVideo()
            setPlayer(ytPlayer)
          },
          onError: () => onError?.()
        }
      }

      if (!playlistId && videoId) {
        config.videoId = videoId
      }

      ytPlayer = new window.YT.Player(el, config)
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.()
        initPlayer()
      }
    }

    return () => {
      destroyed = true
      if (ytPlayer) {
        try { ytPlayer.destroy() } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (!player || playlistId) return
    if (videoId && videoId !== prevVideoId.current) {
      player.loadVideoById(videoId)
      prevVideoId.current = videoId
    }
  }, [videoId, player, playlistId])

  useEffect(() => {
    if (player) {
      if (isPlaying) player.playVideo()
      else player.pauseVideo()
    }
  }, [isPlaying, player])

  useEffect(() => {
    if (player) player.setVolume(volume)
  }, [volume, player])

  return (
    <div 
      ref={containerRef} 
      className="rounded-xl overflow-hidden transition-all duration-300 mb-4"
    />
  )
}
