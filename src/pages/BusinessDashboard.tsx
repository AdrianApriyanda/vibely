import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, Eye, Heart, Users, Star, DollarSign, BarChart3, Calendar, Megaphone, Image, Settings, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'overview' | 'analytics' | 'reviews' | 'promotions'

export default function BusinessDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const businessStats = [
    { icon: Eye, label: 'Views', value: '12.4K', change: '+23%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Heart, label: 'Saves', value: '3.2K', change: '+15%', color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: Users, label: 'Visitors', value: '1.8K', change: '+8%', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Star, label: 'Rating', value: '4.8', change: '+0.2', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ]

  const weeklyData = [
    { day: 'Mon', views: 1200, saves: 340 },
    { day: 'Tue', views: 1450, saves: 420 },
    { day: 'Wed', views: 1100, saves: 280 },
    { day: 'Thu', views: 1800, saves: 560 },
    { day: 'Fri', views: 2200, saves: 680 },
    { day: 'Sat', views: 2600, saves: 820 },
    { day: 'Sun', views: 1900, saves: 540 },
  ]

  const reviews = [
    { id: 1, user: 'Sarah Chen', avatar: 'SC', rating: 5, text: 'Amazing coffee and great atmosphere!', date: '2 hours ago' },
    { id: 2, user: 'Mike Johnson', avatar: 'MJ', rating: 4, text: 'Love the industrial vibe. WiFi is fast.', date: '1 day ago' },
    { id: 3, user: 'David Kim', avatar: 'DK', rating: 5, text: 'Best pour-over in the city. Highly recommend.', date: '3 days ago' },
  ]

  const promotions = [
    { id: 1, title: 'Happy Hour Special', discount: '20% off', active: true, validUntil: 'Dec 31' },
    { id: 2, title: 'Student Discount', discount: '15% off', active: true, validUntil: 'Ongoing' },
    { id: 3, title: 'Weekend Brunch', discount: 'Free coffee', active: false, validUntil: 'Expired' },
  ]

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Business Dashboard</h1>
          <p className="text-xs text-zinc-500">The Brew Lab</p>
        </div>
      </motion.div>

      {/* Business Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl">
            ☕
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">The Brew Lab</h2>
            <p className="text-sm text-zinc-400">Coffee Shop · Tech District</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Claimed</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Trending</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-neon-blue/20 text-neon-blue'
                : 'glass text-zinc-400 hover:text-zinc-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {businessStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4"
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.bg)}>
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">{stat.change}</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Trending Score */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Trending Score</h3>
                <span className="text-2xl font-bold text-neon-blue">94</span>
              </div>
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">You're in the top 5% of places in your area</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                  <Image className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Upload Photos</p>
                  <p className="text-xs text-zinc-500">Update gallery</p>
                </div>
              </button>
              <button className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-neon-blue" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Promote</p>
                  <p className="text-xs text-zinc-500">Create promotion</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-4">Weekly Performance</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyData.map((day, i) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 h-32">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.views / 2600) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-neon-blue/30 rounded-t-lg"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.saves / 820) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-neon-purple/30 rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-neon-blue/30" />
                  <span className="text-xs text-zinc-400">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-neon-purple/30" />
                  <span className="text-xs text-zinc-400">Saves</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">Peak Hours</h3>
              <div className="space-y-2">
                {[
                  { hour: '8AM - 10AM', intensity: 85, label: 'Morning Rush' },
                  { hour: '12PM - 2PM', intensity: 95, label: 'Lunch Peak' },
                  { hour: '5PM - 7PM', intensity: 70, label: 'After Work' },
                  { hour: '8PM - 10PM', intensity: 45, label: 'Evening' },
                ].map(peak => (
                  <div key={peak.hour} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-zinc-400">{peak.hour}</div>
                    <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${peak.intensity}%` }}
                        transition={{ duration: 0.8 }}
                        className={cn(
                          'h-full rounded-full',
                          peak.intensity > 80 ? 'bg-neon-blue/40' : peak.intensity > 60 ? 'bg-neon-purple/30' : 'bg-zinc-700'
                        )}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-20 text-right">{peak.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">4.8</div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={cn('w-4 h-4', i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400/50 fill-yellow-400/50')} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">234 reviews</p>
                </div>
              </div>
            </div>

            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{review.user}</p>
                    <p className="text-xs text-zinc-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">{review.text}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'promotions' && (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <button className="w-full glass-card p-4 flex items-center justify-center gap-2 border-dashed border-2 border-zinc-700 hover:border-neon-blue/50 transition-colors">
              <Plus className="w-5 h-5 text-neon-blue" />
              <span className="text-sm font-medium text-neon-blue">Create New Promotion</span>
            </button>

            {promotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'glass-card p-4',
                  !promo.active && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{promo.title}</h3>
                    <p className="text-2xl font-bold text-neon-blue mt-1">{promo.discount}</p>
                    <p className="text-xs text-zinc-500 mt-1">Valid until {promo.validUntil}</p>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    promo.active ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'
                  )}>
                    {promo.active ? 'Active' : 'Expired'}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
