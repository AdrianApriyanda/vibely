import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Sparkles, ArrowRight, Star, TrendingUp, Diamond } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { mockPlaces } from '@/lib/mock-data'
import { cn, formatDistance } from '@/lib/utils'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const trendingPlaces = mockPlaces.filter(p => p.isTrending).slice(0, 4)
  const hiddenGems = mockPlaces.filter(p => p.isHiddenGem).slice(0, 3)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse animation-delay-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px] animate-pulse animation-delay-600" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-lg mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-[2px]"
          >
            <div className="w-full h-full rounded-3xl bg-zinc-950 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-neon-blue" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          >
            Discover Your{' '}
            <span className="gradient-text">Next Favorite</span>{' '}
            Spot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-400 text-lg mb-8 leading-relaxed"
          >
            Swipe through amazing places around you. From hidden gems to trending hotspots, find your perfect spot with AI-powered recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate(user ? '/explore' : '/auth')}
              className="group px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl font-semibold text-white shadow-neon hover:shadow-neon-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Explore Nearby
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 glass rounded-2xl font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8 max-w-lg mx-auto">
            <TrendingUp className="w-6 h-6 text-neon-blue" />
            <h2 className="text-2xl font-bold">Trending Nearby</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 max-w-lg mx-auto snap-x snap-mandatory">
            {trendingPlaces.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/place/${place.id}`)}
                className="snap-start flex-shrink-0 w-72 cursor-pointer group"
              >
                <div className="glass-card overflow-hidden hover:border-neon-blue/30 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{place.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{place.name}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">{place.address}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                      <MapPin className="w-3 h-3" />
                      <span>{formatDistance(place.distance || 0)} away</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <h2 className="text-2xl font-bold mb-8">Explore Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Coffee', icon: '☕', color: 'from-orange-500/20 to-amber-500/20' },
              { name: 'Barber', icon: '✂️', color: 'from-blue-500/20 to-cyan-500/20' },
              { name: 'Salon', icon: '💇', color: 'from-pink-500/20 to-rose-500/20' },
              { name: 'Gym', icon: '💪', color: 'from-green-500/20 to-emerald-500/20' },
              { name: 'Coworking', icon: '💼', color: 'from-purple-500/20 to-violet-500/20' },
              { name: 'Restaurant', icon: '🍽️', color: 'from-red-500/20 to-orange-500/20' },
            ].map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/explore')}
                className={cn(
                  'glass-card p-6 text-center hover:border-white/20 transition-all duration-300',
                  'bg-gradient-to-br',
                  cat.color
                )}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-medium text-sm">{cat.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Hidden Gems Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <Diamond className="w-6 h-6 text-neon-purple" />
            <h2 className="text-2xl font-bold">Hidden Gems</h2>
          </div>

          <div className="space-y-4">
            {hiddenGems.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => navigate(`/place/${place.id}`)}
                className="glass-card p-4 flex gap-4 cursor-pointer hover:border-neon-purple/30 transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{place.name}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{place.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-full">
                      Hidden Gem
                    </span>
                    <span className="text-xs text-zinc-500">{formatDistance(place.distance || 0)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-purple/10 to-neon-pink/10" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
              <p className="text-zinc-400 mb-6">
                Join thousands of explorers discovering amazing places every day.
              </p>
              <button
                onClick={() => navigate(user ? '/swipe' : '/auth')}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl font-semibold text-white shadow-neon hover:shadow-neon-lg transition-all duration-300"
              >
                {user ? 'Start Swiping' : 'Get Started Free'}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-zinc-600 text-sm">
        <p>© 2024 SwipeMap. All rights reserved.</p>
      </footer>
    </div>
  )
}
