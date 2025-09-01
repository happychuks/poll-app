"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Poll } from "@/types"

interface EditPollFormProps {
  poll: Poll
  onSave: (updatedPoll: {
    title: string
    description?: string
    options: string[]
    isPublic: boolean
    allowMultipleVotes: boolean
    expiresAt?: string
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function EditPollForm({ poll, onSave, onCancel, isLoading = false }: EditPollFormProps) {
  const [title, setTitle] = useState(poll.title)
  const [description, setDescription] = useState(poll.description || "")
  const [options, setOptions] = useState(poll.options.map(opt => opt.text))
  const [isPublic, setIsPublic] = useState(poll.isPublic)
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(poll.allowMultipleVotes)
  const [expiresAt, setExpiresAt] = useState(
    poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : ""
  )
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const hasVotes = totalVotes > 0

  // Update form when poll changes
  useEffect(() => {
    setTitle(poll.title)
    setDescription(poll.description || "")
    setOptions(poll.options.map(opt => opt.text))
    setIsPublic(poll.isPublic)
    setAllowMultipleVotes(poll.allowMultipleVotes)
    setExpiresAt(
      poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : ""
    )
  }, [poll])

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
    
    const validOptions = options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options")
      return
    }
    
    const updatedPoll = {
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions,
      isPublic,
      allowMultipleVotes,
      expiresAt: expiresAt || undefined
    }
    
    // Check if there are any changes
    const hasChanges = 
      title !== poll.title ||
      description !== (poll.description || "") ||
      JSON.stringify(validOptions) !== JSON.stringify(poll.options.map(opt => opt.text)) ||
      isPublic !== poll.isPublic ||
      allowMultipleVotes !== poll.allowMultipleVotes ||
      expiresAt !== (poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : "")
    
    if (!hasChanges) {
      alert("No changes detected")
      return
    }
    
    if (hasVotes) {
      setShowConfirmation(true)
    } else {
      onSave(updatedPoll)
    }
  }

  const handleConfirmEdit = () => {
    const validOptions = options.filter(option => option.trim() !== "")
    const updatedPoll = {
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions,
      isPublic,
      allowMultipleVotes,
      expiresAt: expiresAt || undefined
    }
    
    setShowConfirmation(false)
    onSave(updatedPoll)
  }

  const handleCancel = () => {
    // Reset form to original values
    setTitle(poll.title)
    setDescription(poll.description || "")
    setOptions(poll.options.map(opt => opt.text))
    setIsPublic(poll.isPublic)
    setAllowMultipleVotes(poll.allowMultipleVotes)
    setExpiresAt(
      poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : ""
    )
    onCancel()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Poll</CardTitle>
        <CardDescription>
          Update your poll settings and options
        </CardDescription>
        {!poll.isActive && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ This poll is closed and cannot be edited.
            </p>
          </div>
        )}
        {hasVotes && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ This poll has {totalVotes} votes. Editing options may affect voting results.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={`space-y-6 ${!poll.isActive ? "opacity-50 pointer-events-none" : ""}`}>
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
          
          {showConfirmation ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium mb-2">
                  ⚠️ Confirm Poll Edit
                </p>
                <p className="text-yellow-700 text-sm mb-3">
                  This poll has {totalVotes} votes. Editing options may affect voting results and could confuse voters. Are you sure you want to proceed?
                </p>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p><strong>Changes detected:</strong></p>
                  {title !== poll.title && <p>• Title: &ldquo;{poll.title}&rdquo; → &ldquo;{title}&rdquo;</p>}
                  {description !== (poll.description || "") && <p>• Description updated</p>}
                  {JSON.stringify(options.filter(opt => opt.trim() !== "")) !== JSON.stringify(poll.options.map(opt => opt.text)) && <p>• Poll options modified</p>}
                  {isPublic !== poll.isPublic && <p>• Public setting: {poll.isPublic ? "Public" : "Private"} → {isPublic ? "Public" : "Private"}</p>}
                  {allowMultipleVotes !== poll.allowMultipleVotes && <p>• Multiple votes: {poll.allowMultipleVotes ? "Allowed" : "Not allowed"} → {allowMultipleVotes ? "Allowed" : "Not allowed"}</p>}
                  {expiresAt !== (poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : "") && <p>• Expiration date updated</p>}
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleConfirmEdit}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Yes, Edit Poll"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
