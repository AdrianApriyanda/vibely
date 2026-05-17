import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          preferences: Record<string, unknown>
          stats: Record<string, unknown>
          created_at: string
        }
      }
      places: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          address: string
          coordinates: [number, number]
          rating: number
          review_count: number
          price_level: number
          images: string[]
          phone: string | null
          website: string | null
          hours: Record<string, string>
          amenities: string[]
          tags: string[]
          vibe: string[]
          is_open: boolean
          is_trending: boolean
          is_hidden_gem: boolean
          ai_summary: string | null
          crowd_level: string | null
          wifi_speed: string | null
          created_at: string
          updated_at: string
        }
      }
      swipes: {
        Row: {
          id: string
          user_id: string
          place_id: string
          action: 'pass' | 'save' | 'super_like'
          created_at: string
        }
      }
      saved_places: {
        Row: {
          id: string
          user_id: string
          place_id: string
          collection_id: string | null
          created_at: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          places: string[]
          cover_image: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          place_id: string
          user_id: string
          user_name: string
          user_avatar: string | null
          rating: number
          text: string
          images: string[] | null
          likes: number
          created_at: string
        }
      }
    }
  }
}
