import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getPriceLevel(level: number): string {
  return '💰'.repeat(level)
}

export function isOpenNow(hours: Record<string, string>): boolean {
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' })
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const hoursStr = hours[day as keyof typeof hours]
  if (!hoursStr || hoursStr === 'Closed') return false

  const [open, close] = hoursStr.split(' - ')
  const [openHour, openMin] = open.split(':').map(Number)
  const [closeHour, closeMin] = close.split(':').map(Number)

  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin

  return currentTime >= openTime && currentTime <= closeTime
}

export function getVibeColor(vibe: string): string {
  const colors: Record<string, string> = {
    cozy: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    industrial: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    luxury: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'hidden gem': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    aesthetic: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    quiet: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    lively: 'bg-red-500/20 text-red-400 border-red-500/30',
    romantic: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    minimalist: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    vintage: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  }
  return colors[vibe.toLowerCase()] || 'bg-white/10 text-white/70 border-white/20'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    coffee: '☕',
    barber: '✂️',
    salon: '💇',
    gym: '💪',
    coworking: '💼',
    restaurant: '🍽️',
    hidden_gem: '💎',
    lifestyle: '✨',
  }
  return icons[category] || '📍'
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    coffee: 'Coffee Shop',
    barber: 'Barber Shop',
    salon: 'Salon',
    gym: 'Gym',
    coworking: 'Coworking',
    restaurant: 'Restaurant',
    hidden_gem: 'Hidden Gem',
    lifestyle: 'Lifestyle',
  }
  return labels[category] || category
}
