'use client'

import Image from 'next/image'

export default function EnvironmentShowcase() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Screenshot image with rounded corners */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <Image
          src="/environments.png"
          alt="Environment Selection Modal"
          width={500}
          height={400}
          className="w-full h-auto shadow-3xl"
          priority
        />
      </div>
    </div>
  )
}
