import { User as SupabaseUser } from '@supabase/supabase-js'

// We'll use the Supabase User type directly since it already has user_metadata
export type User = SupabaseUser

export interface PollOption {
  id: string
  text: string
  votes: number
  pollId: string
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  createdBy: string
  isActive: boolean
  isPublic: boolean
  allowMultipleVotes: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Vote {
  id: string
  pollId: string
  optionId: string
  userId: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
