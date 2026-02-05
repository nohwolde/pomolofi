'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface FeatureSectionProps {
  backgroundUrl?: string
  variant?: 'dark' | 'darker' | 'gradient'
  children: React.ReactNode
  className?: string
}

export default function FeatureSection({ 
  backgroundUrl,
  variant = 'dark',
  children,
  className = ''
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const variantStyles = {
    dark: 'bg-blue-950',
    darker: 'bg-blue-950/80',
    gradient: 'bg-gradient-to-b from-blue-950 to-blue-900'
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative min-h-[80vh] flex items-center overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundUrl ? (
          <>
            <Image
              src={backgroundUrl}
              alt="Background"
              fill
              className="object-cover"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className={`absolute inset-0 ${variantStyles[variant]}`} />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        {children}
      </div>
    </section>
  )
}
