'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

export const AuthModal = ({ showAuthModal, setShowAuthModal }: AuthModalProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [user] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      setShowAuthModal(false)
    }
  }, [user, setShowAuthModal])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      setShowAuthModal(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-3xl p-8 w-[400px] text-center relative shadow-[0_0_50px_rgba(0,0,0,0.3)]"
      >
        <h2 className="text-2xl font-medium text-white/90 mb-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/20 rounded-xl px-4 py-3 text-white placeholder-white/30 
              focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/10
              shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/20 rounded-xl px-4 py-3 text-white placeholder-white/30 
              focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/10
              shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          />
          
          {error && <p className="text-red-400 text-sm drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black/20 text-white hover:bg-white/20 transition-colors
              border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]
              relative before:absolute before:inset-0 before:rounded-xl 
              before:bg-gradient-to-r before:from-black/10 before:to-transparent before:-z-10"
          >
            <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </span>
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={() => signInWithPopup(auth, googleProvider)}
          className="w-full py-3 px-4 rounded-xl bg-black/20 text-white hover:bg-white/20 transition-colors
            flex items-center justify-center gap-2 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]
            relative before:absolute before:inset-0 before:rounded-xl 
            before:bg-gradient-to-r before:from-black/10 before:to-transparent before:-z-10"
        >
          <FcGoogle className="text-xl relative z-10" />
          <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            Continue with Google
          </span>
        </button>
        
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6 text-sm text-white/50 hover:text-white transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>

        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white/90 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function UserButton() {
  const [user, loading] = useAuthState(auth)
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      setShowAuthModal(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse bg-white/20 rounded-full" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-lg
          border border-white/5 shadow-[0_0_10px_rgba(0,0,0,0.2)]
          relative before:absolute before:inset-0 before:rounded-lg 
          before:bg-gradient-to-r before:from-white/5 before:to-transparent before:-z-10"
        >
          <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            {user.displayName || user.email}
          </span>
        </span>
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 
            shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-colors
            relative before:absolute before:inset-0 before:rounded-lg 
            before:bg-gradient-to-r before:from-black/10 before:to-transparent before:-z-10"
        >
          <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">Sign Out</span>
        </button>

        <AnimatePresence>
          {showSignOutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
              onClick={(e) => e.target === e.currentTarget && setShowSignOutConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-effect rounded-3xl p-8 w-[400px] text-center"
              >
                <h2 className="text-2xl font-light text-white mb-4">
                  Sign Out?
                </h2>
                <p className="text-white/60 mb-8">
                  Your progress will be saved and you can sign back in anytime.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => signOut(auth)}
                    className="px-6 py-3 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => setShowSignOutConfirm(false)}
                    className="px-6 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 
        shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-colors
        relative before:absolute before:inset-0 before:rounded-lg 
        before:bg-gradient-to-r before:from-black/10 before:to-transparent before:-z-10"
      >
        <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">Sign In</span>
      </button>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
        )}
      </AnimatePresence>
    </>
  )
} 