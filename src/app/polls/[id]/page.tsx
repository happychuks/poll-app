"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types"
import { ArrowLeft, Share2 } from "lucide-react"

// Mock data for demonstration
const mockPoll: Poll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see what the community prefers. This poll will help us understand the most popular programming languages among developers.",
  options: [
    { id: "1-1", text: "JavaScript", votes: 45, pollId: "1" },
    { id: "1-2", text: "Python", votes: 38, pollId: "1" },
    { id: "1-3", text: "TypeScript", votes: 32, pollId: "1" },
    { id: "1-4", text: "Rust", votes: 15, pollId: "1" },
    { id: "1-5", text: "Go", votes: 12, pollId: "1" },
  ],
  createdBy: "user1",
  isActive: true,
  isPublic: true,
  allowMultipleVotes: false,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
}

export default function PollDetailPage() {
  const params = useParams()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch poll data based on params.id
    console.log("Fetching poll with ID:", params.id)
    
    // Simulate API call
    setTimeout(() => {
      setPoll(mockPoll)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleVote = (pollId: string, optionId: string) => {
    // TODO: Implement voting logic
    console.log("Voting:", { pollId, optionId })
    
    // Update local state for demo
    setPoll(prevPoll => 
      prevPoll ? {
        ...prevPoll,
        options: prevPoll.options.map(option =>
          option.id === optionId
            ? { ...option, votes: option.votes + 1 }
            : option
        )
      } : null
    )
    
    setHasVoted(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll?.title,
        text: poll?.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll not found</h1>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/polls">Back to Polls</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/polls">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </a>
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.title}</h1>
              {poll.description && (
                <p className="text-gray-600 mb-4">{poll.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created {poll.createdAt.toLocaleDateString()}</span>
                <span>{poll.isActive ? "Active" : "Closed"}</span>
                {poll.expiresAt && (
                  <span>Expires {poll.expiresAt.toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <PollCard
          poll={poll}
          onVote={hasVoted ? undefined : handleVote}
          showResults={hasVoted || !poll.isActive}
        />
        
        {hasVoted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✓ Thank you for voting! You can see the results above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
