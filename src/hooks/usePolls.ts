import { useState, useEffect } from "react"
import { Poll } from "@/types"

// Mock data - replace with actual API calls
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers",
    options: [
      { id: "1-1", text: "JavaScript", votes: 45, pollId: "1" },
      { id: "1-2", text: "Python", votes: 38, pollId: "1" },
      { id: "1-3", text: "TypeScript", votes: 32, pollId: "1" },
      { id: "1-4", text: "Rust", votes: 15, pollId: "1" },
    ],
    createdBy: "user1",
    isActive: true,
    isPublic: true,
    allowMultipleVotes: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Best framework for building web apps?",
    description: "Share your experience and preferences",
    options: [
      { id: "2-1", text: "React", votes: 52, pollId: "2" },
      { id: "2-2", text: "Vue", votes: 28, pollId: "2" },
      { id: "2-3", text: "Angular", votes: 20, pollId: "2" },
      { id: "2-4", text: "Svelte", votes: 18, pollId: "2" },
    ],
    createdBy: "user2",
    isActive: true,
    isPublic: true,
    allowMultipleVotes: false,
    expiresAt: new Date("2024-02-15"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all polls
  const fetchPolls = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/polls')
      // const data = await response.json()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setPolls(mockPolls)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch polls')
    } finally {
      setLoading(false)
    }
  }

  // Fetch single poll
  const fetchPoll = async (id: string): Promise<Poll | null> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/polls/${id}`)
      // const data = await response.json()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const poll = mockPolls.find(p => p.id === id)
      return poll || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch poll')
      return null
    }
  }

  // Create new poll
  const createPoll = async (pollData: Omit<Poll, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/polls', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(pollData)
      // })
      // const newPoll = await response.json()
      
      const newPoll: Poll = {
        ...pollData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setPolls(prev => [newPoll, ...prev])
      return newPoll
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll')
      throw err
    }
  }

  // Vote on a poll
  const voteOnPoll = async (pollId: string, optionId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/polls/${pollId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ optionId })
      // })
      
      // Update local state
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll.id === pollId 
            ? {
                ...poll,
                options: poll.options.map(option =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                )
              }
            : poll
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote')
      throw err
    }
  }

  // Delete poll
  const deletePoll = async (pollId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/polls/${pollId}`, { method: 'DELETE' })
      
      setPolls(prev => prev.filter(poll => poll.id !== pollId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete poll')
      throw err
    }
  }

  // Get user's polls
  const getUserPolls = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${userId}/polls`)
      // const data = await response.json()
      
      const userPolls = mockPolls.filter(poll => poll.createdBy === userId)
      return userPolls
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user polls')
      return []
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return {
    polls,
    loading,
    error,
    fetchPolls,
    fetchPoll,
    createPoll,
    voteOnPoll,
    deletePoll,
    getUserPolls,
  }
}
