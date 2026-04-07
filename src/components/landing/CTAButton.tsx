'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'large'
  onClick?: () => void
}

export default function CTAButton({ 
  href, 
  children, 
  variant = 'primary',
  size = 'default',
  onClick
}: CTAButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl font-medium
    transition-all duration-300
    cursor-pointer
    relative overflow-hidden
  `
  
  const sizeClasses = {
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: `
      bg-white text-black
      hover:bg-white/90
      shadow-lg shadow-white/10
    `,
    secondary: `
      bg-white/10 text-white
      border border-white/20
      backdrop-blur-sm
      hover:bg-white/20
    `,
    ghost: `
      bg-transparent text-white
      border border-white/30
      hover:bg-white/10
      hover:border-white/50
    `
  }

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <Link href={href}>
      <motion.span
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}
