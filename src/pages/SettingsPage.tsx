import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Moon, MapPin, Shield, HelpCircle, LogOut, ChevronRight, User, Sliders } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface SettingItem {
  icon: React.ElementType
  label: string
  description?: string
  type: 'toggle' | 'link' | 'action'
  value?: boolean
  onChange?: (value: boolean) => void
  onClick?: () => void
  danger?: boolean
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [locationServices, setLocationServices] = useState(true)

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Get alerts about nearby gems',
          type: 'toggle' as const,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Always use dark theme',
          type: 'toggle' as const,
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          icon: MapPin,
          label: 'Location Services',
          description: 'Use precise location',
          type: 'toggle' as const,
          value: locationServices,
          onChange: setLocationServices,
        },
      ] as SettingItem[],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          type: 'link' as const,
          onClick: () => navigate('/profile'),
        },
        {
          icon: Sliders,
          label: 'Discovery Preferences',
          type: 'link' as const,
          onClick: () => {},
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          type: 'link' as const,
          onClick: () => {},
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          type: 'link' as const,
          onClick: () => {},
        },
      ] as SettingItem[],
    },
    {
      title: '',
      items: [
        {
          icon: LogOut,
          label: 'Sign Out',
          type: 'action' as const,
          onClick: async () => {
            await signOut()
            navigate('/')
          },
          danger: true,
        },
      ] as SettingItem[],
    },
  ]

  return (
    <div className="min-h-screen px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title || 'danger'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex }}
          >
            {section.title && (
              <h2 className="text-sm font-semibold text-zinc-500 mb-3 px-1">{section.title}</h2>
            )}
            <div className="glass-card overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className={cn(
                    'flex items-center gap-4 p-4',
                    itemIndex < section.items.length - 1 && 'border-b border-white/5',
                    item.type === 'link' && 'cursor-pointer hover:bg-white/5 transition-colors',
                    item.type === 'action' && 'cursor-pointer hover:bg-white/5 transition-colors'
                  )}
                  onClick={item.type !== 'toggle' ? item.onClick : undefined}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    item.danger ? 'bg-red-500/10' : 'bg-white/5'
                  )}>
                    <item.icon className={cn(
                      'w-5 h-5',
                      item.danger ? 'text-red-400' : 'text-zinc-400'
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium text-sm',
                      item.danger && 'text-red-400'
                    )}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                    )}
                  </div>

                  {item.type === 'toggle' && (
                    <button
                      onClick={() => item.onChange?.(!item.value)}
                      className={cn(
                        'w-12 h-7 rounded-full transition-colors relative',
                        item.value ? 'bg-neon-blue/30' : 'bg-zinc-800'
                      )}
                    >
                      <motion.div
                        animate={{ x: item.value ? 20 : 2 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={cn(
                          'w-5 h-5 rounded-full absolute top-1',
                          item.value ? 'bg-neon-blue' : 'bg-zinc-600'
                        )}
                      />
                    </button>
                  )}

                  {(item.type === 'link' || item.type === 'action') && (
                    <ChevronRight className={cn(
                      'w-5 h-5',
                      item.danger ? 'text-red-400/50' : 'text-zinc-600'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-zinc-600 mt-8"
      >
        Vibely v1.0.0
      </motion.p>
    </div>
  )
}
