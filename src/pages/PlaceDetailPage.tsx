import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, MapPin, Clock, Phone, Globe, Heart, Share2, Navigation, Wifi, Car, Cigarette, Wind, Check, X, ChevronRight } from 'lucide-react'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { mockReviews } from '@/lib/mock-data'
import { cn, formatDistance, getPriceLevel, getVibeColor, isOpenNow } from '@/lib/utils'
import { useState } from 'react'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { places, savedPlaces, savePlace, unsavePlace } = usePlacesStore()
  const [activeImage, setActiveImage] = useState(0)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const place = places.find(p => p.id === id)
  if (!place) return <div className="min-h-screen flex items-center justify-center">Place not found</div>

  const isSaved = savedPlaces.includes(place.id)
  const reviews = mockReviews.filter(r => r.placeId === place.id)
  const similarPlaces = places.filter(p => p.category === place.category && p.id !== place.id).slice(0, 4)

  const openStatus = isOpenNow(place.hours)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Gallery */}
      <div className="relative h-[50vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <img
            src={place.images[activeImage]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </motion.div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => isSaved ? unsavePlace(place.id) : savePlace(place.id)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                isSaved ? 'bg-red-500/20 text-red-400' : 'glass hover:bg-white/20'
              )}
            >
              <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
            </button>
            <button className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Dots */}
        {place.images.length > 1 && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
            {place.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === activeImage ? 'bg-white w-6' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        )}

        {/* Place Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">
                {place.category}
              </span>
              {place.isHiddenGem && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  Hidden Gem
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{place.rating}</span>
                <span className="text-zinc-400">({place.reviewCount} reviews)</span>
              </div>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{getPriceLevel(place.priceLevel)}</span>
              <span className="text-zinc-600">·</span>
              <span className={cn('flex items-center gap-1', openStatus ? 'text-green-400' : 'text-red-400')}>
                {openStatus ? (
                  <><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Open</>
                ) : (
                  <><X className="w-3 h-3" /> Closed</>
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 space-y-6">
        {/* AI Summary */}
        {place.aiSummary && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 border-l-4 border-l-neon-blue"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <span className="text-xs">🤖</span>
              </div>
              <span className="text-sm font-semibold text-neon-blue">AI Insight</span>
            </div>
            <p className="text-sm text-zinc-300">{place.aiSummary}</p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3"
        >
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[1]},${place.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-neon-blue/20 text-neon-blue rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neon-blue/30 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </a>
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="flex-1 py-3 glass rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 space-y-3"
        >
          <h3 className="font-semibold mb-3">Information</h3>

          <div className="flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
            <span className="text-zinc-300">{place.address}</span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Clock className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
            <div className="text-zinc-300">
              {Object.entries(place.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="capitalize text-zinc-500 w-20">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {place.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
                {place.website.replace('https://', '')}
              </a>
            </div>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 pt-2">
            {place.amenities.map(amenity => (
              <span key={amenity} className="text-xs bg-white/5 text-zinc-400 px-2 py-1 rounded-full flex items-center gap-1">
                {amenity === 'wifi' && <Wifi className="w-3 h-3" />}
                {amenity === 'parking' && <Car className="w-3 h-3" />}
                {amenity === 'smoking_area' && <Cigarette className="w-3 h-3" />}
                {amenity === 'ac' && <Wind className="w-3 h-3" />}
                {amenity === 'work_friendly' && <Check className="w-3 h-3" />}
                {amenity.replace('_', ' ')}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="font-semibold mb-3">Vibes</h3>
          <div className="flex flex-wrap gap-2">
            {place.vibe.map(vibe => (
              <motion.span
                key={vibe}
                whileHover={{ scale: 1.05 }}
                className={cn('text-sm px-3 py-1.5 rounded-full border', getVibeColor(vibe))}
              >
                {vibe}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Reviews</h3>
            <span className="text-sm text-zinc-400">{reviews.length} reviews</span>
          </div>

          <div className="space-y-3">
            {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {review.userAvatar ? (
                    <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm">
                      {review.userName[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{review.userName}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={cn(
                            'w-3 h-3',
                            j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">{review.text}</p>
              </motion.div>
            ))}
          </div>

          {reviews.length > 2 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-3 mt-3 text-sm text-neon-blue hover:text-neon-blue/80 transition-colors"
            >
              {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
            </button>
          )}
        </motion.div>

        {/* Similar Places */}
        {similarPlaces.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <h3 className="font-semibold mb-3">Similar Places</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2">
              {similarPlaces.map(similar => (
                <button
                  key={similar.id}
                  onClick={() => navigate(`/place/${similar.id}`)}
                  className="snap-start flex-shrink-0 w-40 text-left"
                >
                  <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                    <img
                      src={similar.images[0]}
                      alt={similar.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="font-semibold text-sm truncate">{similar.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-zinc-300">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{similar.rating}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
