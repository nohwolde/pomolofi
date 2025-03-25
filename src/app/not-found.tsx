'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            bounce: 0.3,
            duration: 0.8,
          }}
        >
          <h1 className="text-8xl font-bold text-white/80 mb-2">404</h1>
          <p className="text-xl text-white/60 mb-8">
            This path leads to tranquility, but not the page you're looking for.
          </p>
          
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 
              rounded-xl text-white/90
              bg-white/10 backdrop-blur-md 
              border border-white/10
              shadow-lg shadow-black/20
              hover:bg-white/20 
              transition-all duration-300"
          >
            <span className="text-nowrap">Return to Focus</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 