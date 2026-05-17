import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion'
import { X, Heart, Star, MapPin, Clock, Wifi, Volume2 } from 'lucide-react'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { cn, formatDistance, getPriceLevel, getVibeColor } from '@/lib/utils'
import type { Place } from '@/types'

const SWIPE_THRESHOLD = 100
const SWIPE_VELOCITY = 500

function SwipeCard({ place, index, onSwipe }: { place: Place; index: number; onSwipe: (id: string, action: string) => void }) {
  const navigate = useNavigate()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const controls = useAnimation()

  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const likeOpacity = useTransform(x, [50, 150], [0, 1])
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0])
  const superLikeOpacity = useTransform(y, [-150, -50], [1, 0])

  const handleDragEnd = useCallback(async (_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const xOffset = info.offset.x
    const yOffset = info.offset.y
    const xVelocity = info.velocity.x
    const yVelocity = info.velocity.y

    if (xOffset > SWIPE_THRESHOLD || xVelocity > SWIPE_VELOCITY) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } })
      onSwipe(place.id, 'save')
    } else if (xOffset < -SWIPE_THRESHOLD || xVelocity < -SWIPE_VELOCITY) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } })
      onSwipe(place.id, 'pass')
    } else if (yOffset < -SWIPE_THRESHOLD || yVelocity < -SWIPE_VELOCITY) {
      await controls.start({ y: -500, opacity: 0, transition: { duration: 0.3 } })
      onSwipe(place.id, 'super_like')
    } else {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', damping: 20 } })
    }
  }, [controls, onSwipe, place.id])

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex: 100 - index }}
      animate={controls}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 touch-none"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Image */}
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Swipe Indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 right-8 border-4 border-green-500 text-green-500 font-bold text-2xl px-4 py-2 rounded-xl rotate-12"
        >
          SAVE
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 left-8 border-4 border-red-500 text-red-500 font-bold text-2xl px-4 py-2 rounded-xl -rotate-12"
        >
          PASS
        </motion.div>
        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute top-8 left-1/2 -translate-x-1/2 border-4 border-blue-400 text-blue-400 font-bold text-2xl px-4 py-2 rounded-xl"
        >
          SUPER LIKE
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {place.isOpen && (
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Open Now
              </span>
            )}
            {place.isTrending && (
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Trending
              </span>
            )}
            {place.isHiddenGem && (
              <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Diamond className="w-3 h-3" />
                Hidden Gem
              </span>
            )}
            {place.crowdLevel === 'low' && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                Quiet Now
              </span>
            )}
            {place.wifiSpeed === 'fast' && (
              <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                Fast WiFi
              </span>
            )}
          </div>

          {/* Name & Rating */}
          <h2 className="text-2xl font-bold mb-1">{place.name}</h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{place.rating}</span>
              <span className="text-zinc-400 text-sm">({place.reviewCount})</span>
            </div>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-400 text-sm">{getPriceLevel(place.priceLevel)}</span>
          </div>

          {/* Address & Distance */}
          <div className="flex items-center gap-4 text-sm text-zinc-300 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {formatDistance(place.distance || 0)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {place.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2">
            {place.vibe.map(vibe => (
              <span
                key={vibe}
                className={cn('text-xs px-2 py-1 rounded-full border', getVibeColor(vibe))}
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Tap to view detail */}
        <button
          onClick={() => navigate(`/place/${place.id}`)}
          className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

export default function SwipePage() {
  const navigate = useNavigate()
  const { filteredPlaces, swipePlace } = usePlacesStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)

  const handleSwipe = useCallback((id: string, action: string) => {
    swipePlace(id, action as 'pass' | 'save' | 'super_like')
    setDirection(action)
    setCurrentIndex(prev => prev + 1)
    setTimeout(() => setDirection(null), 1000)
  }, [swipePlace])

  const handleButtonSwipe = useCallback((action: string) => {
    if (currentIndex >= filteredPlaces.length) return
    const place = filteredPlaces[currentIndex]
    handleSwipe(place.id, action)
  }, [currentIndex, filteredPlaces, handleSwipe])

  const remainingPlaces = filteredPlaces.slice(currentIndex)

  if (remainingPlaces.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
        <p className="text-zinc-400 text-center mb-6">You've seen all places nearby. Check back later for new spots!</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-3 bg-neon-blue/20 text-neon-blue rounded-2xl font-semibold hover:bg-neon-blue/30 transition-colors"
        >
          Explore Map
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-center">Discover</h1>
        <p className="text-zinc-400 text-center text-sm mt-1">
          {remainingPlaces.length} places nearby
        </p>
      </div>

      {/* Cards Stack */}
      <div className="flex-1 px-4 relative" style={{ minHeight: '60vh' }}>
        <AnimatePresence>
          {remainingPlaces.slice(0, 3).map((place, i) => (
            <SwipeCard
              key={place.id}
              place={place}
              index={i}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('pass')}
            className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
          >
            <X className="w-6 h-6 text-red-500" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('super_like')}
            className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors"
          >
            <Star className="w-5 h-5 text-blue-400" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('save')}
            className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 transition-colors"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </motion.button>
        </div>

        {/* Swipe Hints */}
        <div className="flex justify-center gap-8 mt-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <X className="w-3 h-3" /> Pass
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> Super
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> Save
          </span>
        </div>
      </div>

      {/* Direction Feedback */}
      <AnimatePresence>
        {direction && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              'fixed bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-semibold z-50',
              direction === 'save' && 'bg-green-500/20 text-green-400 border border-green-500/30',
              direction === 'pass' && 'bg-red-500/20 text-red-400 border border-red-500/30',
              direction === 'super_like' && 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            )}
          >
            {direction === 'save' && 'Saved to favorites!'}
            {direction === 'pass' && 'Passed'}
            {direction === 'super_like' && 'Super Liked!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
