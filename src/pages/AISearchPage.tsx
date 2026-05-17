import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Clock, TrendingUp, X, ArrowRight, Mic, MapPin, Star } from 'lucide-react'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { searchSuggestions } from '@/lib/mock-data'
import { cn, formatDistance } from '@/lib/utils'

interface ParsedIntent {
  category?: string
  vibe?: string
  priceLevel?: number
  openNow?: boolean
  distance?: string
}

function parseNaturalLanguage(query: string): ParsedIntent {
  const lower = query.toLowerCase()
  const intent: ParsedIntent = {}

  // Category detection
  if (lower.includes('coffee') || lower.includes('cafe')) intent.category = 'coffee'
  else if (lower.includes('barber')) intent.category = 'barber'
  else if (lower.includes('salon')) intent.category = 'salon'
  else if (lower.includes('gym')) intent.category = 'gym'
  else if (lower.includes('cowork')) intent.category = 'coworking'
  else if (lower.includes('restaurant') || lower.includes('food')) intent.category = 'restaurant'
  else if (lower.includes('hidden gem')) intent.category = 'hidden_gem'

  // Vibe detection
  if (lower.includes('quiet')) intent.vibe = 'quiet'
  else if (lower.includes('cozy')) intent.vibe = 'cozy'
  else if (lower.includes('aesthetic')) intent.vibe = 'aesthetic'
  else if (lower.includes('industrial')) intent.vibe = 'industrial'
  else if (lower.includes('luxury')) intent.vibe = 'luxury'

  // Price detection
  if (lower.includes('cheap') || lower.includes('affordable')) intent.priceLevel = 1
  else if (lower.includes('expensive') || lower.includes('fancy')) intent.priceLevel = 4

  // Open now
  if (lower.includes('open now') || lower.includes('open')) intent.openNow = true

  // Distance
  if (lower.includes('nearby') || lower.includes('near')) intent.distance = 'nearby'

  return intent
}

export default function AISearchPage() {
  const navigate = useNavigate()
  const { places, setFilters } = usePlacesStore()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<typeof places>([])
  const [showResults, setShowResults] = useState(false)
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setQuery(searchQuery)

    const intent = parseNaturalLanguage(searchQuery)
    setParsedIntent(intent)

    // Simulate AI processing
    setTimeout(() => {
      let filtered = [...places]

      if (intent.category) {
        filtered = filtered.filter(p => p.category === intent.category)
      }
      if (intent.vibe) {
        filtered = filtered.filter(p => p.vibe.includes(intent.vibe))
      }
      if (intent.priceLevel) {
        filtered = filtered.filter(p => p.priceLevel <= intent.priceLevel)
      }
      if (intent.openNow) {
        filtered = filtered.filter(p => p.isOpen)
      }

      // Sort by relevance (distance + rating)
      filtered.sort((a, b) => {
        const scoreA = (a.rating * 10) - ((a.distance || 0) / 100)
        const scoreB = (b.rating * 10) - ((b.distance || 0) / 100)
        return scoreB - scoreA
      })

      setResults(filtered)
      setIsSearching(false)
      setShowResults(true)
    }, 800)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold">AI Search</h1>
        </div>
        <p className="text-zinc-400 text-sm">Describe what you're looking for in natural language</p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="glass rounded-2xl p-1 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-neon-blue" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              if (e.target.value === '') {
                setShowResults(false)
                setParsedIntent(null)
              }
            }}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="Try: quiet coffee shop nearby..."
            className="flex-1 bg-transparent text-sm placeholder:text-zinc-500 outline-none py-3"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setShowResults(false)
                setParsedIntent(null)
              }}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || isSearching}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              query.trim() && !isSearching
                ? 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30'
                : 'bg-zinc-800 text-zinc-600'
            )}
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* AI Processing Animation */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-neon-blue animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-neon-blue" />
            </div>
            <p className="text-sm text-zinc-400">AI is analyzing your request...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Parsed Intent */}
            {parsedIntent && Object.keys(parsedIntent).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <div className="glass-card p-3 flex flex-wrap gap-2">
                  <span className="text-xs text-zinc-500 mr-2">AI understood:</span>
                  {parsedIntent.category && (
                    <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">
                      {parsedIntent.category}
                    </span>
                  )}
                  {parsedIntent.vibe && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                      {parsedIntent.vibe}
                    </span>
                  )}
                  {parsedIntent.priceLevel && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {'💰'.repeat(parsedIntent.priceLevel)}
                    </span>
                  )}
                  {parsedIntent.openNow && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Open Now
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {results.length} {results.length === 1 ? 'place' : 'places'} found
              </h3>
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {results.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/place/${place.id}`)}
                  className="glass-card p-4 flex gap-4 cursor-pointer hover:border-neon-blue/30 transition-all"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{place.name}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">{place.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {place.rating}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {formatDistance(place.distance || 0)}
                      </span>
                      {place.isOpen && (
                        <span className="text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          Open
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">No places match your search</p>
                <p className="text-zinc-600 text-sm mt-1">Try different keywords</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions (when no search active) */}
      {!showResults && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Recent Searches */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </h3>
            <div className="space-y-2">
              {searchSuggestions
                .filter(s => s.type === 'recent')
                .map(suggestion => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="w-full glass-card p-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm">{suggestion.text}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Trending Searches */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions
                .filter(s => s.type === 'trending')
                .map(suggestion => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className="glass px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors"
                  >
                    {suggestion.text}
                  </button>
                ))}
            </div>
          </div>

          {/* Example Queries */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Try asking</h3>
            <div className="space-y-2">
              {[
                'quiet place to work with WiFi',
                'cheap coffee nearby',
                'barber open now',
                'hidden gem cafe aesthetic',
                'pet friendly places',
                'romantic dinner spots',
              ].map((example, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleSearch(example)}
                  className="w-full glass-card p-3 flex items-center justify-between text-left hover:border-neon-blue/30 transition-all"
                >
                  <span className="text-sm text-zinc-300">{example}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
