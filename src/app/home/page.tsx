'use client'

import { useRef } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import FeatureSection from '@/components/landing/FeatureSection'
import DemoTimer from '@/components/landing/DemoTimer'
import DemoMusicPlayer from '@/components/landing/DemoMusicPlayer'
import DemoSoundPlayer from '@/components/landing/DemoSoundPlayer'
import DemoTaskList from '@/components/landing/DemoTaskList'
import EnvironmentShowcase from '@/components/landing/EnvironmentShowcase'
import CTAButton from '@/components/landing/CTAButton'
import { getBlobUrl } from '@/lib/blob-urls'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <HeroSection onScrollClick={scrollToFeatures} />

      {/* Features */}
      <div ref={featuresRef}>
        {/* Timer Feature */}
        <FeatureSection variant="dark">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Master Your Focus with Pomodoro
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-white/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Work in focused 25-minute sprints with built-in breaks. 
                Customize your timer durations and track your progress 
                through each Pomodoro session.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CTAButton href="/" variant="secondary">
                  Try the Timer
                </CTAButton>
              </motion.div>
            </div>
            <motion.div 
              className="flex-1 flex justify-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DemoTimer />
            </motion.div>
          </div>
        </FeatureSection>

        {/* Music Player Feature */}
        <FeatureSection variant="gradient">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Curated Lofi Streams
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-white/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Choose from handpicked 24/7 lofi streams including Lofi Girl, 
                ChillwithTaiki, and Chillhop Music. Or add your own custom 
                YouTube video for the perfect focus soundtrack.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CTAButton href="/" variant="secondary">
                  Listen Now
                </CTAButton>
              </motion.div>
            </div>
            <motion.div 
              className="flex-1 flex justify-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DemoMusicPlayer />
            </motion.div>
          </div>
        </FeatureSection>

        {/* Ambient Sounds Feature */}
        <FeatureSection variant="darker">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Layer Ambient Sounds
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-white/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Enhance your focus with calming ambient sounds. Mix gentle rain, 
                crackling fire, or ocean waves with your music for the perfect 
                concentration atmosphere.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CTAButton href="/" variant="secondary">
                  Explore Sounds
                </CTAButton>
              </motion.div>
            </div>
            <motion.div 
              className="flex-1 flex justify-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DemoSoundPlayer />
            </motion.div>
          </div>
        </FeatureSection>

        {/* Environments Feature - uses background image */}
        <FeatureSection
          backgroundUrl={getBlobUrl('scenes', 'sunbeam-forest-thumbnail.jpeg')}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="text-center max-w-3xl">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Beautiful Environments
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-white/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Transform your workspace with 14 stunning scenes. From cozy cafes 
                to cherry blossom lakes, find the perfect backdrop for your focus sessions.
              </motion.p>
            </div>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <EnvironmentShowcase />
            </motion.div>
          </div>
        </FeatureSection>

        {/* Task Management Feature */}
        <FeatureSection variant="dark">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Stay Organized
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-white/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Keep track of your tasks with a simple, focused task list. 
                See your current focus, upcoming tasks, and celebrate 
                completed work all in one place.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CTAButton href="/" variant="secondary">
                  Get Started
                </CTAButton>
              </motion.div>
            </div>
            <motion.div 
              className="flex-1 flex justify-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DemoTaskList />
            </motion.div>
          </div>
        </FeatureSection>

        {/* Final CTA Section - uses background image */}
        <FeatureSection
          backgroundUrl={getBlobUrl('scenes', 'starry-night-thumbnail.jpeg')}
          className="min-h-screen"
        >
          <div className="flex flex-col items-center justify-center text-center py-20">
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Ready to Focus?
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Join thousands of people who use PomoLofi to stay productive 
              and focused. No signup required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CTAButton href="/" size="large">
                Start Focusing Now
              </CTAButton>
            </motion.div>
          </div>
        </FeatureSection>
      </div>
    </div>
  )
}
