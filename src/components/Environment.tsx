'use client'

import { useState } from 'react'
import Image from 'next/image'

type Scene = {
  id: string
  name: string
  background: string
}

const scenes: Scene[] = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: '/scenes/cozy-cafe.jpg',
  },
  {
    id: 'beach',
    name: 'Beach',
    background: '/scenes/beach.jpg',
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