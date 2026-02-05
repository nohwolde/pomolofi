'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getBlobUrl } from '@/lib/blob-urls'
import Image from 'next/image'
import CTAButton from './CTAButton'

interface HeroSectionProps {
  onScrollClick: () => void
}

export default function HeroSection({ onScrollClick }: HeroSectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  const videoUrl = getBlobUrl('scenes', 'cherry-blossom-lake.mp4')
  const thumbnailUrl = getBlobUrl('scenes', 'cherry-blossom-lake-thumbnail.jpeg')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Thumbnail for faster loading */}
        {isLoading && (
          <Image
            src={thumbnailUrl}
            alt="Cherry Blossom Lake"
            fill
            priority
            className="object-cover"
          />
        )}
        
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          onLoadedData={() => setIsLoading(false)}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Focus. Flow. Create.
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            PomoLofi is your peaceful productivity companion combining Pomodoro timers, 
            lofi music, and beautiful ambient scenes.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <CTAButton href="/" size="large">
            Start Focusing
          </CTAButton>
          <CTAButton href="#features" variant="ghost" size="large" onClick={onScrollClick}>
            See Features
          </CTAButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={onScrollClick}
        className="absolute bottom-8 left-0 right-0 z-10 cursor-pointer flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <span className="text-white/70 text-sm font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Scroll to explore</span>
          <svg 
            className="w-6 h-6 text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}
