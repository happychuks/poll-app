"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

export function CreatePollForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isPublic, setIsPublic] = useState(true)
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [expiresAt, setExpiresAt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const validOptions = options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options")
      setIsLoading(false)
      return
    }
    
    // TODO: Implement poll creation logic
    console.log("Creating poll:", {
      title,
      description,
      options: validOptions,
      isPublic,
      allowMultipleVotes,
      expiresAt: expiresAt || null
    })
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Reset form
      setTitle("")
      setDescription("")
      setOptions(["", ""])
      setIsPublic(true)
      setAllowMultipleVotes(false)
      setExpiresAt("")
    }, 1000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a new poll</CardTitle>
        <CardDescription>
          Set up your poll with options and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Enter poll description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">Poll Options *</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make poll public
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowMultipleVotes"
                checked={allowMultipleVotes}
                onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="allowMultipleVotes" className="text-sm font-medium">
                Allow multiple votes
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expiresAt" className="text-sm font-medium">
                Expiration Date (optional)
              </label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating poll..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

