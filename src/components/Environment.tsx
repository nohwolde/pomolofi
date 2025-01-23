'use client'

import { useState } from 'react'
import Image from 'next/image'
import beachImg from '@/scenes/beach.jpg'
import cafeImg from '@/scenes/beach.jpg'
import { AnimatePresence, motion } from 'framer-motion'

type Scene = {
  id: string
  name: string
  background: any
  type: 'image' | 'video'  // Add type to distinguish between media types
}

const scenes: Scene[] = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: cafeImg,
    type: 'image',
  },
  {
    id: 'beach',
    name: 'Beach',
    background: beachImg,
    type: 'image',
  },
  {
    id: 'snow',
    name: 'Snowy Scene',
    background: '/scenes/0snow.mp4',
    type: 'video',
  },
  // Add more scenes here
]

type EnvironmentProps = {
  currentScene: Scene
}

export default function Environment({ currentScene }: EnvironmentProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0.5, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        {currentScene.type === 'video' ? (
          <video
            key={currentScene.id}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={currentScene.background} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={currentScene.background}
            alt={currentScene.name}
            fill
            priority
            className="object-cover"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
} 