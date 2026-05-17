import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, MapPin, Heart, Star, Eye, Flame, ChevronRight, Trophy, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlacesStore } from '@/contexts/PlacesContext'
import { mockUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { savedPlaces } = usePlacesStore()
  const currentUser = user || mockUser

  const stats = [
    { icon: Eye, label: 'Swipes', value: currentUser.stats.swipes, color: 'text-blue-400' },
    { icon: Heart, label: 'Saves', value: savedPlaces.length, color: 'text-red-400' },
    { icon: Star, label: 'Reviews', value: currentUser.stats.reviews, color: 'text-yellow-400' },
    { icon: MapPin, label: 'Visited', value: currentUser.stats.placesVisited, color: 'text-green-400' },
  ]

  const insights = [
    { icon: Trophy, text: 'Likes aesthetic cafes', color: 'bg-pink-500/20 text-pink-400' },
    { icon: TrendingUp, text: 'Prefers nearby places', color: 'bg-blue-500/20 text-blue-400' },
    { icon: Flame, text: 'Night explorer', color: 'bg-orange-500/20 text-orange-400' },
    { icon: Award, text: '12 day streak', color: 'bg-yellow-500/20 text-yellow-400' },
  ]

  return (
    <div className="min-h-screen px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold">
                {currentUser.name[0]}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
              <Flame className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-zinc-400 text-sm">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">
                Explorer
              </span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                {currentUser.stats.streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card p-4"
          >
            <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-[10px]">
            🤖
          </div>
          AI Insights
        </h3>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn('flex items-center gap-3 p-3 rounded-xl', insight.color)}
            >
              <insight.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{insight.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Saved', target: 'The Brew Lab', time: '2 hours ago', icon: Heart },
            { action: 'Reviewed', target: 'Midnight Ramen', time: '1 day ago', icon: Star },
            { action: 'Visited', target: 'Iron Paradise Gym', time: '2 days ago', icon: MapPin },
            { action: 'Discovered', target: 'Secret Garden Cafe', time: '3 days ago', icon: Eye },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3 p-3 glass rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}</span>{' '}
                  <span className="text-zinc-400">{activity.target}</span>
                </p>
                <p className="text-xs text-zinc-500">{activity.time}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
