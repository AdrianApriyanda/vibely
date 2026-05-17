import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, MapPin, Star, Heart, Navigation, Coffee, Scissors, Dumbbell, Briefcase, UtensilsCrossed, Gem, Sparkles } from 'lucide-react'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { cn, formatDistance, getCategoryIcon, getCategoryLabel } from '@/lib/utils'
import type { Place, PlaceCategory } from '@/types'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2p3Z3Q3bmwxMHZ1aTQ0bnN4bm13d2lkbiJ9.FpVd8p4a2f4k4y4y4y4y4y'

const categories: { id: PlaceCategory; icon: React.ReactNode; label: string }[] = [
  { id: 'coffee', icon: <Coffee className="w-4 h-4" />, label: 'Coffee' },
  { id: 'barber', icon: <Scissors className="w-4 h-4" />, label: 'Barber' },
  { id: 'salon', icon: <Sparkles className="w-4 h-4" />, label: 'Salon' },
  { id: 'gym', icon: <Dumbbell className="w-4 h-4" />, label: 'Gym' },
  { id: 'coworking', icon: <Briefcase className="w-4 h-4" />, label: 'Coworking' },
  { id: 'restaurant', icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Food' },
  { id: 'hidden_gem', icon: <Gem className="w-4 h-4" />, label: 'Hidden' },
]

const darkMapStyle = 'mapbox://styles/mapbox/dark-v11'

function PlaceMarker({ place, onClick }: { place: Place; onClick: () => void }) {
  const categoryColors: Record<string, string> = {
    coffee: '#f97316',
    barber: '#3b82f6',
    salon: '#ec4899',
    gym: '#22c55e',
    coworking: '#8b5cf6',
    restaurant: '#ef4444',
    hidden_gem: '#a855f7',
    lifestyle: '#06b6d4',
  }

  return (
    <Marker longitude={place.coordinates[0]} latitude={place.coordinates[1]} anchor="bottom">
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="relative group"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
          style={{ backgroundColor: categoryColors[place.category] || '#666' }}
        >
          <span className="text-white text-lg">{getCategoryIcon(place.category)}</span>
        </div>
        {place.isTrending && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </motion.button>
    </Marker>
  )
}

export default function ExplorePage() {
  const navigate = useNavigate()
  const { filteredPlaces, filters, setFilters, savedPlaces, savePlace, unsavePlace } = usePlacesStore()
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 14,
  })

  const mapRef = useRef(null)

  const handleCategoryToggle = (category: PlaceCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    setFilters({ categories: newCategories })
  }

  const isSaved = (placeId: string) => savedPlaces.includes(placeId)

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={darkMapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" className="!bg-zinc-900/80 !backdrop-blur-xl !border-white/10 !rounded-xl !m-4" />
        <GeolocateControl
          position="bottom-right"
          className="!bg-zinc-900/80 !backdrop-blur-xl !border-white/10 !rounded-xl !m-4 !mb-16"
        />

        {/* Place Markers */}
        {filteredPlaces.map(place => (
          <PlaceMarker
            key={place.id}
            place={place}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Selected Place Popup */}
        {selectedPlace && (
          <Popup
            longitude={selectedPlace.coordinates[0]}
            latitude={selectedPlace.coordinates[1]}
            anchor="top"
            onClose={() => setSelectedPlace(null)}
            closeButton={false}
            offset={[0, -20]}
          >
            <div className="w-64 p-0">
              <div className="relative h-32 overflow-hidden rounded-t-xl">
                <img
                  src={selectedPlace.images[0]}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{selectedPlace.rating}</span>
                  <span>·</span>
                  <span>{formatDistance(selectedPlace.distance || 0)}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/place/${selectedPlace.id}`)}
                    className="flex-1 py-2 bg-neon-blue/20 text-neon-blue text-xs rounded-xl font-medium hover:bg-neon-blue/30 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => isSaved(selectedPlace.id) ? unsavePlace(selectedPlace.id) : savePlace(selectedPlace.id)}
                    className={cn(
                      'w-10 h-8 rounded-xl flex items-center justify-center transition-colors',
                      isSaved(selectedPlace.id)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isSaved(selectedPlace.id) && 'fill-current')} />
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Floating Search Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 z-10"
      >
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm placeholder:text-zinc-500 outline-none"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
              showFilters ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/10 text-zinc-400'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-20 left-4 right-4 z-10"
      >
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryToggle(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                filters.categories.includes(cat.id)
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                  : 'glass text-zinc-300 hover:bg-white/10'
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filter Sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-zinc-900/95 backdrop-blur-2xl rounded-t-3xl border-t border-white/10"
          >
            <div className="p-6">
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              {/* Radius */}
              <div className="mb-6">
                <label className="text-sm text-zinc-400 mb-2 block">Distance: {filters.radius}m</label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={filters.radius}
                  onChange={e => setFilters({ radius: Number(e.target.value) })}
                  className="w-full accent-neon-blue"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="text-sm text-zinc-400 mb-2 block">Min Rating: {filters.rating}+</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={e => setFilters({ rating: Number(e.target.value) })}
                  className="w-full accent-neon-blue"
                />
              </div>

              {/* Open Now */}
              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={e => setFilters({ openNow: e.target.checked })}
                    className="w-5 h-5 rounded accent-neon-blue"
                  />
                  <span className="text-sm">Open Now Only</span>
                </label>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-neon-blue/20 text-neon-blue rounded-2xl font-semibold hover:bg-neon-blue/30 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby Places Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-20 left-4 right-4 z-10"
      >
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Nearby Places</h3>
            <span className="text-xs text-zinc-400">{filteredPlaces.length} found</span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
            {filteredPlaces.slice(0, 5).map(place => (
              <motion.button
                key={place.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedPlace(place)
                  setViewState({
                    longitude: place.coordinates[0],
                    latitude: place.coordinates[1],
                    zoom: 16,
                  })
                }}
                className="snap-start flex-shrink-0 w-48 text-left"
              >
                <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="font-semibold text-sm truncate">{place.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-zinc-300">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{place.rating}</span>
                      <span>·</span>
                      <span>{formatDistance(place.distance || 0)}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
