'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getBlobUrl } from '@/lib/blob-urls'

type Scene = {
  id: string
  name: string
  background: string
  thumbnail: string
  type: 'video' | 'image'
}

const scenes: Scene[] = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: getBlobUrl('scenes', 'cozy-cafe.jpg'),
    thumbnail: getBlobUrl('scenes', 'cozy-cafe.jpg'),
    type: 'image',
  },
  {
    id: 'beach',
    name: 'Beach',
    background: getBlobUrl('scenes', 'beach.jpg'),
    thumbnail: getBlobUrl('scenes', 'beach.jpg'),
    type: 'image',
  },
  {
    id: 'snow',
    name: 'Snowy Scene',
    background: getBlobUrl('scenes', 'snow.mp4'),
    thumbnail: getBlobUrl('scenes', 'snow-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'winter-city',
    name: 'Winter City',
    background: getBlobUrl('scenes', 'winter-city.mp4'),
    thumbnail: getBlobUrl('scenes', 'winter-city-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'sunbeam-forest',
    name: 'Sunbeam Forest',
    background: getBlobUrl('scenes', 'sunbeam-forest.mp4'),
    thumbnail: getBlobUrl('scenes', 'sunbeam-forest-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'summer-village',
    name: 'Summer Village',
    background: getBlobUrl('scenes', 'summer-village.mp4'),
    thumbnail: getBlobUrl('scenes', 'summer-village-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'sunset-beach',
    name: 'Sunset Beach',
    background: getBlobUrl('scenes', 'sunset-beach.mp4'),
    thumbnail: getBlobUrl('scenes', 'sunset-beach-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'autumn-lake',
    name: 'Autumn Lake',
    background: getBlobUrl('scenes', 'autumn-lake.mp4'),
    thumbnail: getBlobUrl('scenes', 'autumn-lake-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'cherry-blossom-lake',
    name: 'Cherry Blossom Lake',
    background: getBlobUrl('scenes', 'cherry-blossom-lake.mp4'),
    thumbnail: getBlobUrl('scenes', 'cherry-blossom-lake-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    background: getBlobUrl('scenes', 'starry-night.mp4'),
    thumbnail: getBlobUrl('scenes', 'starry-night-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'charming-cafe',
    name: 'Charming Cafe',
    background: getBlobUrl('scenes', 'charming-cafe.mp4'),
    thumbnail: getBlobUrl('scenes', 'charming-cafe-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'magical-forest',
    name: 'Magical Forest',
    background: getBlobUrl('scenes', 'magical-forest.mp4'),
    thumbnail: getBlobUrl('scenes', 'magical-forest-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    background: getBlobUrl('scenes', 'black-hole.mp4'),
    thumbnail: getBlobUrl('scenes', 'black-hole-thumbnail.jpeg'),
    type: 'video',
  },
  {
    id: 'dark-star',
    name: 'Dark Star',
    background: getBlobUrl('scenes', 'dark-star.mp4'),
    thumbnail: getBlobUrl('scenes', 'dark-star-thumbnail.jpeg'),
    type: 'video',
  }
]

export default function EnvironmentGallery() {
  const [hoveredScene, setHoveredScene] = useState<string | null>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  const handleMouseEnter = (sceneId: string) => {
    setHoveredScene(sceneId)
    const video = videoRefs.current[sceneId]
    if (video) {
      video.play().catch(() => {
        // Autoplay might be blocked
      })
    }
  }

  const handleMouseLeave = (sceneId: string) => {
    setHoveredScene(null)
    const video = videoRefs.current[sceneId]
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }

  const videos = scenes.filter(scene => scene.type === 'video')
  const images = scenes.filter(scene => scene.type === 'image')

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8">
      {/* Live Wallpapers */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Live Wallpapers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {videos.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onMouseEnter={() => handleMouseEnter(scene.id)}
              onMouseLeave={() => handleMouseLeave(scene.id)}
              className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer
                ring-2 ring-transparent hover:ring-white/50 transition-all"
            >
              {/* Thumbnail */}
              <Image
                src={scene.thumbnail}
                alt={scene.name}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  hoveredScene === scene.id ? 'opacity-0' : 'opacity-100'
                }`}
              />
              
              {/* Video (hidden until hover) */}
              <video
                ref={(el) => { videoRefs.current[scene.id] = el }}
                src={`${scene.background}#t=0.5`}
                muted
                playsInline
                loop
                preload="none"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  hoveredScene === scene.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              {/* Label */}
              <span className="absolute bottom-2 left-2 text-xs md:text-sm text-white font-medium drop-shadow-lg">
                {scene.name}
              </span>
              
              {/* Play indicator */}
              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center transition-opacity ${
                  hoveredScene === scene.id ? 'opacity-100' : 'opacity-0'
                }`}>
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Still Images */}
      <div>
        <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Still Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer
                ring-2 ring-transparent hover:ring-white/50 transition-all"
            >
              <Image
                src={scene.thumbnail}
                alt={scene.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              {/* Label */}
              <span className="absolute bottom-2 left-2 text-xs md:text-sm text-white font-medium drop-shadow-lg">
                {scene.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
