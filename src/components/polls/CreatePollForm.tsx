"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, AlertCircle, CheckCircle } from "lucide-react"
import { usePolls } from "@/hooks/usePolls"
import { cn } from "@/lib/utils"

interface FormData {
  title: string
  description: string
  options: string[]
  isPublic: boolean
  allowMultipleVotes: boolean
  expiresAt: string
}

interface FormErrors {
  title?: string
  options?: string
  general?: string
}

const initialFormData: FormData = {
  title: "",
  description: "",
  options: ["", ""],
  isPublic: true,
  allowMultipleVotes: false,
  expiresAt: ""
}

export function CreatePollForm() {
  const { createPoll, error: apiError } = usePolls()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Memoized validation function
  const validateForm = useCallback((data: FormData): FormErrors => {
    const newErrors: FormErrors = {}
    
    if (!data.title.trim()) {
      newErrors.title = "Poll title is required"
    } else if (data.title.trim().length < 3) {
      newErrors.title = "Poll title must be at least 3 characters long"
    }
    
    const validOptions = data.options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required"
    } else if (validOptions.length > 10) {
      newErrors.options = "Maximum 10 options allowed"
    }
    
    return newErrors
  }, [])

  // Memoized form update handlers
  const updateFormField = useCallback((field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const addOption = useCallback(() => {
    if (formData.options.length < 10) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ""] }))
      // Clear options error when adding new option
      if (errors.options) {
        setErrors(prev => ({ ...prev, options: undefined }))
      }
    }
  }, [formData.options.length, errors.options])

  const removeOption = useCallback((index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
      // Clear options error when removing option
      if (errors.options) {
        setErrors(prev => ({ ...prev, options: undefined }))
      }
    }
  }, [formData.options.length, errors.options])

  const updateOption = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newOptions = [...prev.options]
      newOptions[index] = value
      return { ...prev, options: newOptions }
    })
    // Clear options error when user starts typing
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: undefined }))
    }
  }, [errors.options])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setIsSuccess(false)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      const validOptions = formData.options.filter(option => option.trim() !== "")
      
      const pollData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        options: validOptions.map(text => ({ text, votes: 0, pollId: "", id: "" })),
        createdBy: "current-user", // TODO: Get from auth context
        isActive: true,
        isPublic: formData.isPublic,
        allowMultipleVotes: formData.allowMultipleVotes,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
      }
      
      await createPoll(pollData)
      setIsSuccess(true)
      resetForm()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    } catch {
      setErrors({ general: "Failed to create poll. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, createPoll, resetForm])

  // Memoized computed values
  const canAddOption = useMemo(() => formData.options.length < 10, [formData.options.length])
  const canRemoveOption = useMemo(() => formData.options.length > 2, [formData.options.length])
  const validOptionsCount = useMemo(() => 
    formData.options.filter(option => option.trim() !== "").length, 
    [formData.options]
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a new poll</CardTitle>
        <CardDescription>
          Set up your poll with options and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Poll created successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {(errors.general || apiError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{errors.general || apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Poll Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter poll title"
              value={formData.title}
              onChange={(e) => updateFormField("title", e.target.value)}
              className={cn(errors.title && "border-red-500 focus:border-red-500")}
              aria-describedby={errors.title ? "title-error" : undefined}
              required
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>
          
          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Enter poll description (optional)"
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
            />
          </div>
          
          {/* Poll Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Poll Options *</label>
              <span className="text-sm text-gray-500">
                {validOptionsCount}/10 options
              </span>
            </div>
            
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1"
                  required
                />
                {canRemoveOption && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    aria-label={`Remove option ${index + 1}`}
                    className="shrink-0"
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
              disabled={!canAddOption}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
            
            {errors.options && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.options}
              </p>
            )}
          </div>
          
          {/* Poll Settings */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Poll Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => updateFormField("isPublic", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make poll public
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowMultipleVotes"
                  checked={formData.allowMultipleVotes}
                  onChange={(e) => updateFormField("allowMultipleVotes", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="allowMultipleVotes" className="text-sm font-medium text-gray-700">
                  Allow multiple votes
                </label>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expiresAt" className="text-sm font-medium text-gray-700">
                  Expiration Date (optional)
                </label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => updateFormField("expiresAt", e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            aria-describedby={isLoading ? "loading-description" : undefined}
          >
            {isLoading ? "Creating poll..." : "Create Poll"}
          </Button>
          
          {isLoading && (
            <p id="loading-description" className="text-sm text-gray-500 text-center">
              Please wait while we create your poll...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

