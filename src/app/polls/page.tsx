"use client"

import { useState } from "react"
import Link from "next/link"
import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for demonstration
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

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all")

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || 
                         (filter === "active" && poll.isActive) ||
                         (filter === "closed" && !poll.isActive)
    return matchesSearch && matchesFilter
  })

  const handleVote = (pollId: string, optionId: string) => {
    // TODO: Implement voting logic
    console.log("Voting:", { pollId, optionId })
    
    // Update local state for demo
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
          <p className="text-gray-600 mt-2">Discover and vote on polls created by the community</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "closed" ? "default" : "outline"}
            onClick={() => setFilter("closed")}
          >
            Closed
          </Button>
        </div>
      </div>

      {filteredPolls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVote={handleVote}
              showResults={false}
              showEditButton={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
