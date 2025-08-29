export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

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
