import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Folder, Trash2, MoreVertical, X, Check } from 'lucide-react'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { cn, formatDistance } from '@/lib/utils'

export default function SavedPage() {
  const navigate = useNavigate()
  const { places, savedPlaces, collections, unsavePlace, removeFromCollection } = usePlacesStore()
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all')
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const savedPlacesData = places.filter(p => savedPlaces.includes(p.id))

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return
    // In real app, would create collection via API
    setNewCollectionName('')
    setShowNewCollection(false)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-1">Saved Places</h1>
        <p className="text-zinc-400">{savedPlaces.length} places saved</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeTab === 'all'
              ? 'bg-neon-blue/20 text-neon-blue'
              : 'glass text-zinc-400'
          )}
        >
          All Places
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeTab === 'collections'
              ? 'bg-neon-blue/20 text-neon-blue'
              : 'glass text-zinc-400'
          )}
        >
          Collections
        </button>
      </div>

      {/* All Places Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'all' && (
          <motion.div
            key="all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {savedPlacesData.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex gap-4 cursor-pointer hover:border-white/20 transition-all"
                onClick={() => navigate(`/place/${place.id}`)}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{place.name}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-1">{place.address}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                          Saved
                        </span>
                        <span>·</span>
                        <span>{formatDistance(place.distance || 0)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        unsavePlace(place.id)
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {savedPlacesData.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">No saved places yet</p>
                <button
                  onClick={() => navigate('/swipe')}
                  className="mt-4 px-6 py-2 bg-neon-blue/20 text-neon-blue rounded-xl text-sm font-medium"
                >
                  Start Exploring
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <motion.div
            key="collections"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* New Collection Button */}
            <button
              onClick={() => setShowNewCollection(true)}
              className="w-full glass-card p-4 flex items-center gap-3 hover:border-neon-blue/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-neon-blue" />
              </div>
              <span className="font-medium">Create New Collection</span>
            </button>

            {/* Collections Grid */}
            {collections.map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden cursor-pointer hover:border-white/20 transition-all"
                onClick={() => setSelectedCollection(collection.id)}
              >
                <div className="relative h-32">
                  {collection.coverImage ? (
                    <img
                      src={collection.coverImage}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <Folder className="w-12 h-12 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{collection.name}</h3>
                        <p className="text-xs text-zinc-400">{collection.places.length} places</p>
                      </div>
                      {collection.isPrivate && (
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Collection Modal */}
      <AnimatePresence>
        {showNewCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowNewCollection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">New Collection</h3>
              <input
                type="text"
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-neon-blue/50 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewCollection(false)}
                  className="flex-1 py-3 glass rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="flex-1 py-3 bg-neon-blue/20 text-neon-blue rounded-xl text-sm font-medium"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-zinc-950"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="w-10 h-10 glass rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">
                    {collections.find(c => c.id === selectedCollection)?.name}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {collections.find(c => c.id === selectedCollection)?.places.length} places
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {collections
                  .find(c => c.id === selectedCollection)
                  ?.places.map(placeId => {
                    const place = places.find(p => p.id === placeId)
                    if (!place) return null
                    return (
                      <div
                        key={place.id}
                        className="glass-card p-4 flex gap-4"
                        onClick={() => navigate(`/place/${place.id}`)}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={place.images[0]}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{place.name}</h3>
                          <p className="text-xs text-zinc-400 mt-1">{place.address}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromCollection(selectedCollection, place.id)
                          }}
                          className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
