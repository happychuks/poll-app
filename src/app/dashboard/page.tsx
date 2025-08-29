"use client"

import { useState, useEffect } from "react"
import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Poll } from "@/types"
import { Plus, BarChart3, Users, TrendingUp } from "lucide-react"

// Mock data for demonstration
const mockUserPolls: Poll[] = [
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
    createdBy: "user1",
    isActive: false,
    isPublic: true,
    allowMultipleVotes: false,
    expiresAt: new Date("2024-02-15"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>(mockUserPolls)
  const [activeTab, setActiveTab] = useState<"overview" | "my-polls" | "voted">("overview")

  const totalPolls = polls.length
  const activePolls = polls.filter(poll => poll.isActive).length
  const totalVotes = polls.reduce((sum, poll) => 
    sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
  )

  const stats = [
    {
      title: "Total Polls",
      value: totalPolls,
      icon: BarChart3,
      description: "Polls you've created"
    },
    {
      title: "Active Polls",
      value: activePolls,
      icon: TrendingUp,
      description: "Currently running"
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: Users,
      description: "Across all your polls"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your polls and track your activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "my-polls" ? "default" : "ghost"}
          onClick={() => setActiveTab("my-polls")}
        >
          My Polls
        </Button>
        <Button
          variant={activeTab === "voted" ? "default" : "ghost"}
          onClick={() => setActiveTab("voted")}
        >
          Voted On
        </Button>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button asChild>
              <a href="/polls/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </a>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Polls</CardTitle>
                <CardDescription>Your latest poll creations</CardDescription>
              </CardHeader>
              <CardContent>
                {polls.slice(0, 3).map(poll => (
                  <div key={poll.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{poll.title}</p>
                      <p className="text-sm text-gray-500">
                        {poll.options.reduce((sum, option) => sum + option.votes, 0)} votes
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {poll.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <a href="/polls/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Poll
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/polls">
                    Browse All Polls
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/auth/profile">
                    Edit Profile
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "my-polls" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Polls</h2>
            <Button asChild>
              <a href="/polls/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </a>
            </Button>
          </div>
          
          {polls.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't created any polls yet.</p>
                <Button asChild>
                  <a href="/polls/create">Create your first poll</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {polls.map(poll => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  showResults={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "voted" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Polls You've Voted On</h2>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No voting history yet.</p>
              <Button asChild>
                <a href="/polls">Browse polls to vote</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
