import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, MapPin, Shield, AlertTriangle, TrendingUp, CheckCircle, XCircle, Search, Filter, MoreHorizontal, BarChart3, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminTab = 'overview' | 'places' | 'reviews' | 'users' | 'reports'

interface PlaceModeration {
  id: string
  name: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  submittedBy: string
  date: string
  image: string
}

interface UserModeration {
  id: string
  name: string
  email: string
  status: 'active' | 'suspended' | 'banned'
  joined: string
  reports: number
  avatar: string
}

interface ReportItem {
  id: string
  type: 'place' | 'review' | 'user'
  target: string
  reason: string
  reportedBy: string
  date: string
  status: 'open' | 'resolved'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { icon: Users, label: 'Total Users', value: '12,847', change: '+12%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: MapPin, label: 'Places', value: '3,421', change: '+8%', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Activity, label: 'Daily Active', value: '4,203', change: '+23%', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: AlertTriangle, label: 'Reports', value: '23', change: '-5%', color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  const pendingPlaces: PlaceModeration[] = [
    { id: '1', name: 'Neon Lounge', category: 'Bar', status: 'pending', submittedBy: 'user_123', date: '2 hours ago', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100' },
    { id: '2', name: 'Zen Garden Spa', category: 'Wellness', status: 'pending', submittedBy: 'user_456', date: '5 hours ago', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=100' },
    { id: '3', name: 'Tech Hub Coworking', category: 'Coworking', status: 'approved', submittedBy: 'user_789', date: '1 day ago', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100' },
  ]

  const users: UserModeration[] = [
    { id: '1', name: 'Alex Rivera', email: 'alex@email.com', status: 'active', joined: 'Jan 2024', reports: 0, avatar: 'AR' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@email.com', status: 'active', joined: 'Feb 2024', reports: 1, avatar: 'SC' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', status: 'suspended', joined: 'Dec 2023', reports: 3, avatar: 'MJ' },
  ]

  const reports: ReportItem[] = [
    { id: '1', type: 'review', target: 'Fake review on Brew Lab', reason: 'Spam content', reportedBy: 'user_001', date: '1 hour ago', status: 'open' },
    { id: '2', type: 'place', target: 'Wrong location data', reason: 'Incorrect coordinates', reportedBy: 'user_002', date: '3 hours ago', status: 'resolved' },
    { id: '3', type: 'user', target: 'Harassment report', reason: 'Inappropriate behavior', reportedBy: 'user_003', date: '6 hours ago', status: 'open' },
  ]

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'resolved':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'suspended':
      case 'rejected':
      case 'banned':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-zinc-500/20 text-zinc-400'
    }
  }

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-zinc-500">Superuser access</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-400'
                : 'glass text-zinc-400 hover:text-zinc-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm placeholder:text-zinc-500 outline-none"
          />
          <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Filter className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
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
              {stats.map((stat, i) => (
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

            {/* Activity Chart */}
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-4">Activity (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-32 gap-1">
                {[65, 80, 55, 90, 75, 95, 70].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-red-500/30 to-red-500/10 rounded-t-lg"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <span key={day} className="text-xs text-zinc-500">{day}</span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New place submitted', target: 'Neon Lounge', time: '2 min ago', type: 'info' },
                  { action: 'User reported', target: 'Review #1234', time: '15 min ago', type: 'warning' },
                  { action: 'Place approved', target: 'Zen Garden Spa', time: '1 hour ago', type: 'success' },
                  { action: 'User banned', target: 'spam_user_99', time: '2 hours ago', type: 'error' },
                ].map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      activity.type === 'info' && 'bg-blue-400',
                      activity.type === 'warning' && 'bg-yellow-400',
                      activity.type === 'success' && 'bg-green-400',
                      activity.type === 'error' && 'bg-red-400'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-zinc-500">{activity.target}</p>
                    </div>
                    <span className="text-xs text-zinc-600">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'places' && (
          <motion.div
            key="places"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {pendingPlaces.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-4">
                  <img src={place.image} alt={place.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{place.name}</h3>
                        <p className="text-xs text-zinc-500">{place.category} · {place.date}</p>
                        <p className="text-xs text-zinc-600 mt-1">By {place.submittedBy}</p>
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full', getStatusColor(place.status))}>
                        {place.status}
                      </span>
                    </div>
                    {place.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-xl text-xs font-medium flex items-center justify-center gap-1 hover:bg-green-500/30 transition-colors">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-500/30 transition-colors">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full', getStatusColor(user.status))}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                      <span>Joined {user.joined}</span>
                      <span>{user.reports} reports</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">{report.type}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', getStatusColor(report.status))}>
                        {report.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm">{report.target}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{report.reason}</p>
                    <p className="text-xs text-zinc-600 mt-1">Reported by {report.reportedBy} · {report.date}</p>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
