'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

type Scene = {
  id: string
  name: string
  background: any
  type: 'image' | 'video'
}

type EnvironmentModalProps = {
  isOpen: boolean
  onClose: () => void
  scenes: Scene[]
  onSelectScene: (scene: Scene) => void
}

export default function EnvironmentModal({ isOpen, onClose, scenes, onSelectScene }: EnvironmentModalProps) {
  const images = scenes.filter(scene => scene.type === 'image');
  const videos = scenes.filter(scene => scene.type === 'video');

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-effect rounded-3xl w-full max-w-[800px] mx-4 text-center max-h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Fixed Header */}
          <div className="relative p-8 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-medium text-white/90">Select Environment</h2>
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/60 hover:text-white/90 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Scrollable Content */}
          <div 
            className="overflow-y-auto p-8 pt-4 custom-scrollbar scroll-smooth hover-reveal-scrollbar"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Live Wallpapers Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1}}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Live Wallpapers</h3>
              <div className="grid grid-cols-3 gap-4">
                {videos.map(scene => (
                  <motion.button
                    key={scene.id}
                    onClick={() => onSelectScene(scene)}
                    className="group relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-white/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <video
                      src={scene.background}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-sm text-white font-medium">
                      {scene.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Still Images Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Still Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {images.map(scene => (
                  <motion.button
                    key={scene.id}
                    onClick={() => onSelectScene(scene)}
                    className="group relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-white/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={scene.background}
                      alt={scene.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-sm text-white font-medium">
                      {scene.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  )
} 