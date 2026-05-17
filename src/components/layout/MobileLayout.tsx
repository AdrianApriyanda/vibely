import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Map, Heart, User, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/explore', icon: Home, label: 'Home' },
  { path: '/swipe', icon: Compass, label: 'Swipe' },
  { path: '/explore', icon: Map, label: 'Explore' },
  { path: '/saved', icon: Heart, label: 'Saved' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function MobileLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Main Content */}
      <main className="pb-24 overflow-y-auto h-screen hide-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      >
        <div className="mx-4 mb-4">
          <div className="glass rounded-3xl px-2 py-3 shadow-glass-lg">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300',
                      isActive
                        ? 'text-neon-blue'
                        : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-neon-blue/10 rounded-2xl"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" strokeWidth={isActive ? 2.5 : 1.5} />
                    <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  )
}
