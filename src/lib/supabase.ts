// Copyright (c) 2024 Napulita
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key'

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          handle: string
          display_name: string | null
          avatar_url: string | null
          trust: number
          points: number
          created_at: string
        }
        Insert: {
          id: string
          handle: string
          display_name?: string | null
          avatar_url?: string | null
          trust?: number
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          handle?: string
          display_name?: string | null
          avatar_url?: string | null
          trust?: number
          points?: number
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: number
          user_id: string
          category: 'dog_poop' | 'trash' | 'overflowing_bin' | 'bulky' | 'butts' | 'other'
          status: 'open' | 'claimed' | 'cleaned' | 'invalid'
          note: string | null
          geom: any
          created_at: string
          city_id: number | null
        }
        Insert: {
          id?: number
          user_id: string
          category: 'dog_poop' | 'trash' | 'overflowing_bin' | 'bulky' | 'butts' | 'other'
          status?: 'open' | 'claimed' | 'cleaned' | 'invalid'
          note?: string | null
          geom: any
          created_at?: string
          city_id?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          category?: 'dog_poop' | 'trash' | 'overflowing_bin' | 'bulky' | 'butts' | 'other'
          status?: 'open' | 'claimed' | 'cleaned' | 'invalid'
          note?: string | null
          geom?: any
          created_at?: string
          city_id?: number | null
        }
      }
    }
  }
}
