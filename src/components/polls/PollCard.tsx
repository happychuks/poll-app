"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Vote } from "lucide-react"

interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string, optionId: string) => void
  showResults?: boolean
}

export function PollCard({ poll, onVote, showResults = false }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = (optionId: string) => {
    if (onVote) {
      onVote(poll.id, optionId)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{totalVotes} votes</span>
          <span>{poll.isActive ? "Active" : "Closed"}</span>
          {poll.expiresAt && (
            <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.text}</span>
                {showResults && (
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
              {showResults && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
              {!showResults && poll.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(option.id)}
                  className="w-full justify-start"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Vote
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
