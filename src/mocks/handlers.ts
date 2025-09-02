import { http, HttpResponse } from 'msw'
import { Poll, PollOption } from '@/types'

// Mock data
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

export const handlers = [
  // GET /api/polls - Fetch all polls
  http.get('/api/polls', () => {
    return HttpResponse.json(mockPolls)
  }),

  // GET /api/polls/:id - Fetch single poll
  http.get('/api/polls/:id', ({ params }) => {
    const { id } = params
    const poll = mockPolls.find(p => p.id === id)
    
    if (!poll) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(poll)
  }),

  // POST /api/polls - Create new poll
  http.post('/api/polls', async ({ request }) => {
    const pollData = await request.json()
    
    // Validate required fields
    if (!pollData.title || !pollData.options || pollData.options.length < 2) {
      return new HttpResponse(
        JSON.stringify({ error: 'Title and at least 2 options are required' }),
        { status: 400 }
      )
    }

    const newPoll: Poll = {
      ...pollData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      createdBy: 'user1', // Mock user ID
    }

    mockPolls.push(newPoll)
    return HttpResponse.json(newPoll, { status: 201 })
  }),

  // PUT /api/polls/:id - Update poll
  http.put('/api/polls/:id', async ({ params, request }) => {
    const { id } = params
    const updateData = await request.json()
    
    const pollIndex = mockPolls.findIndex(p => p.id === id)
    if (pollIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const existingPoll = mockPolls[pollIndex]
    
    // Check if poll has votes and options are being modified
    const hasVotes = existingPoll.options.some(opt => opt.votes > 0)
    const optionsChanged = JSON.stringify(updateData.options) !== JSON.stringify(existingPoll.options.map(opt => opt.text))
    
    if (hasVotes && optionsChanged) {
      // In real app, this might require confirmation or special handling
      console.log('Warning: Editing poll with existing votes')
    }

    const updatedPoll: Poll = {
      ...existingPoll,
      ...updateData,
      updatedAt: new Date(),
    }

    mockPolls[pollIndex] = updatedPoll
    return HttpResponse.json(updatedPoll)
  }),

  // POST /api/polls/:id/vote - Vote on poll
  http.post('/api/polls/:id/vote', async ({ params, request }) => {
    const { id } = params
    const { optionId } = await request.json()
    
    const poll = mockPolls.find(p => p.id === id)
    if (!poll) {
      return new HttpResponse(null, { status: 404 })
    }

    if (!poll.isActive) {
      return new HttpResponse(
        JSON.stringify({ error: 'Poll is not active' }),
        { status: 400 }
      )
    }

    const option = poll.options.find(opt => opt.id === optionId)
    if (!option) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid option' }),
        { status: 400 }
      )
    }

    option.votes += 1
    return HttpResponse.json({ success: true, votes: option.votes })
  }),

  // DELETE /api/polls/:id - Delete poll
  http.delete('/api/polls/:id', ({ params }) => {
    const { id } = params
    const pollIndex = mockPolls.findIndex(p => p.id === id)
    
    if (pollIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    mockPolls.splice(pollIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Error simulation endpoint
  http.get('/api/error', () => {
    return new HttpResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }),

  // Network error simulation
  http.get('/api/network-error', () => {
    return HttpResponse.error()
  }),
]
