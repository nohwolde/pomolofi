'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Blocknote
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import FullscreenButton from './FullscreenButton';

interface NotesProps {
  isOpen: boolean
  onClose: () => void
}

const SunIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = ( { className }: { className: string } ) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export default function Notes({ isOpen, onClose }: NotesProps) {
  const [content, setContent] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const editor = useCreateBlockNote({});

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0}}
          transition={{ duration: 0.3 }}
          className={`fixed right-0 top-0 bottom-0 w-[100%] backdrop-blur-xl 
            border-l border-white/10 shadow-2xl z-50 ${theme === 'dark' ? 'bg-black/80' : 'bg-white/50'}`}
        >
          <div className="flex flex-col h-full">
            {/* Header - Fixed with proper alignment for title */}
            <div className="relative flex justify-between items-center p-6 border-b border-white/10">
              {/* Left side */}
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-lg px-2 py-1 rounded-md ${theme === 'dark' ? 'text-white bg-[#222]' : 'text-gray-700 bg-white/60'}`}>Notes</h2>
                <button onClick={handleThemeChange} className="text-white/60 hover:text-white/90 transition-colors">
                  {theme === 'dark' ? (
                    <SunIcon className="w-6 h-6" />
                  ) : (
                    <MoonIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              
              {/* Title Section - Absolutely positioned to center of page */}
              <div className="absolute left-1/2 transform -translate-x-1/2 max-w-md w-1/3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`px-4 py-2 text-2xl font-bold text-center outline-none w-full rounded-md 
                    ${theme === 'dark' 
                      ? 'bg-white/10 text-white border-white/20 focus:border-white/40' 
                      : 'bg-white/50 text-gray-800 border-gray-300 focus:border-gray-500'
                  }`}
                  placeholder="Untitled Note"
                />
              </div>
              
              {/* Right side */}
              <button onClick={onClose} className="text-white/60 hover:text-white/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Editor - Single scrollable area */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-center p-6">
                <div className="w-full max-w-3xl">
                  <div className={`p-6 rounded-md ${theme === 'dark' ? 'bg-[#222]' : 'bg-[#f5f5f5]'}`}>
                    <BlockNoteView editor={editor} theme={theme} />
                  </div>
                </div>
              </div>
            </div>

            <FullscreenButton />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}