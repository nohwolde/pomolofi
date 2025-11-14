'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PoweredBy() {
  return (
    <Link
      href="https://highfly.app?ref=pomolofi"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-16 z-10 cursor-pointer
        flex items-center gap-2 px-3 py-2 mx-1 rounded-xl
        bg-black/20 backdrop-blur-md
        border border-white/20
        shadow-[0_0_15px_rgba(0,0,0,0.5)]
        hover:bg-white/20
        transition-all duration-300
        group
        hidden md:flex"
      aria-label="Powered by Highfly"
    >
      <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
        Powered by
      </span>
      <div className="relative w-20 h-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <Image
          src="/Highfly.svg"
          alt="Highfly"
          fill
          className="object-contain"
        />
      </div>
    </Link>
  )
}

