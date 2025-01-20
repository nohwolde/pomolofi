'use client'

import { useState } from 'react'
import Image from 'next/image'
import beachImg from '@/scenes/beach.jpg'
import cafeImg from '@/scenes/beach.jpg'

type Scene = {
  id: string
  name: string
  background: any
}

const scenes: Scene[] = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: cafeImg,
  },
  {
    id: 'beach',
    name: 'Beach',
    background: beachImg,
  },
  // Add more scenes here
]

type EnvironmentProps = {
  currentScene: Scene
}

export default function Environment({ currentScene }: EnvironmentProps) {
  return (
    <Image
      src={currentScene.background}
      alt={currentScene.name}
      fill
      priority
      className="object-cover"
    />
  )
} 