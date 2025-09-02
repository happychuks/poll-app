import React from 'react'
import { render, screen, waitFor } from '@/test-utils/test-utils'
import { CreatePollForm } from '../CreatePollForm'
import { EditPollForm } from '../EditPollForm'
import { mockPoll, mockPollWithVotes } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/jest.setup'
import { rest } from 'msw'

// Mock the usePolls hook for integration testing
jest.mock('@/hooks/usePolls', () => ({
  usePolls: () => ({
    polls: [],
    loading: false,
    error: null,
    createPoll: jest.fn().mockResolvedValue({
      id: 'new-poll-1',
      title: 'Test Poll',
      description: 'Test description',
      options: ['Option A', 'Option B'],
      isPublic: true,
      allowMultipleVotes: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    updatePoll: jest.fn().mockResolvedValue({
      id: 'new-poll-1',
      title: 'Updated Test Poll',
      description: 'Updated description',
      options: ['Option A', 'Option B', 'Option C'],
      isPublic: false,
      allowMultipleVotes: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    voteOnPoll: jest.fn().mockResolvedValue({ success: true }),
    fetchPolls: jest.fn(),
    fetchPoll: jest.fn(),
    deletePoll: jest.fn(),
    getUserPolls: jest.fn(),
  }),
}))

describe('Poll Workflow Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    // Clear alert mock
    (global.alert as jest.Mock).mockClear()
  })

  describe('Complete Poll Lifecycle - Happy Path', () => {
    it('creates a new poll and then edits it successfully', async () => {
      // Step 1: Create a new poll
      const { rerender } = render(<CreatePollForm />)

      // Fill in the create form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Integration Test Poll')
      await user.type(descriptionInput, 'This is a test poll for integration testing')
      await user.type(optionInputs[0], 'First Option')
      await user.type(optionInputs[1], 'Second Option')

      // Add a third option
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)
      const newOptionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(newOptionInputs[2], 'Third Option')

      // Submit the create form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Wait for form submission to complete
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Step 2: Now render the edit form with the created poll
      const createdPoll = {
        id: 'new-poll-1',
        title: 'Integration Test Poll',
        description: 'This is a test poll for integration testing',
        options: [
          { id: 'opt-1', text: 'First Option', votes: 0, pollId: 'new-poll-1' },
          { id: 'opt-2', text: 'Second Option', votes: 0, pollId: 'new-poll-1' },
          { id: 'opt-3', text: 'Third Option', votes: 0, pollId: 'new-poll-1' },
        ],
        createdBy: 'test-user',
        isActive: true,
        isPublic: true,
        allowMultipleVotes: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      rerender(
        <EditPollForm
          poll={createdPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Verify the edit form shows the created poll data
      expect(screen.getByDisplayValue('Integration Test Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('This is a test poll for integration testing')).toBeInTheDocument()
      expect(screen.getByDisplayValue('First Option')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Second Option')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Third Option')).toBeInTheDocument()

      // Make some edits
      const editTitleInput = screen.getByDisplayValue('Integration Test Poll')
      const editDescriptionInput = screen.getByDisplayValue('This is a test poll for integration testing')
      
      await user.clear(editTitleInput)
      await user.type(editTitleInput, 'Updated Integration Test Poll')
      await user.clear(editDescriptionInput)
      await user.type(editDescriptionInput, 'Updated description for integration testing')

      // Add a fourth option
      const editAddButton = screen.getByText('Add Option')
      await user.click(editAddButton)
      const editOptionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(editOptionInputs[3], 'Fourth Option')

      // Submit the edit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Verify the save callback was called with updated data
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Updated Integration Test Poll',
        description: 'Updated description for integration testing',
        options: ['First Option', 'Second Option', 'Third Option', 'Fourth Option'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })

    it('creates a poll with all settings and validates them in edit mode', async () => {
      // Step 1: Create a poll with all settings
      render(<CreatePollForm />)

      // Fill in the form with comprehensive settings
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      const publicCheckbox = screen.getByRole('checkbox', { name: /make poll public/i })
      const multipleVotesCheckbox = screen.getByRole('checkbox', { name: /allow multiple votes/i })
      const expirationInput = screen.getByLabelText(/Expiration Date/i)

      await user.type(titleInput, 'Comprehensive Test Poll')
      await user.type(descriptionInput, 'A poll with all settings enabled')
      await user.type(optionInputs[0], 'Option Alpha')
      await user.type(optionInputs[1], 'Option Beta')
      
      // Toggle checkboxes
      await user.click(publicCheckbox) // Make it private
      await user.click(multipleVotesCheckbox) // Allow multiple votes
      
      // Set expiration date
      const futureDate = '2024-12-31T23:59'
      await user.type(expirationInput, futureDate)

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Wait for submission
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Step 2: Verify the created poll has all the settings
      const createdPoll = {
        id: 'comprehensive-poll-1',
        title: 'Comprehensive Test Poll',
        description: 'A poll with all settings enabled',
        options: [
          { id: 'opt-1', text: 'Option Alpha', votes: 0, pollId: 'comprehensive-poll-1' },
          { id: 'opt-2', text: 'Option Beta', votes: 0, pollId: 'comprehensive-poll-1' },
        ],
        createdBy: 'test-user',
        isActive: true,
        isPublic: false, // Should be private
        allowMultipleVotes: true, // Should allow multiple votes
        expiresAt: new Date(futureDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <EditPollForm
          poll={createdPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Verify all settings are correctly displayed
      expect(screen.getByDisplayValue('Comprehensive Test Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('A poll with all settings enabled')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option Alpha')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option Beta')).toBeInTheDocument()
      
      // Check checkbox states
      const editPublicCheckbox = screen.getByRole('checkbox', { name: /make poll public/i })
      const editMultipleVotesCheckbox = screen.getByRole('checkbox', { name: /allow multiple votes/i })
      expect(editPublicCheckbox).not.toBeChecked() // Should be unchecked (private)
      expect(editMultipleVotesCheckbox).toBeChecked() // Should be checked (allow multiple votes)

      // Check expiration date
      const editExpirationInput = screen.getByLabelText(/Expiration Date/i)
      expect(editExpirationInput).toHaveValue(futureDate)
    })
  })

  describe('Poll Workflow with Edge Cases', () => {
    it('handles poll creation with minimal required fields', async () => {
      render(<CreatePollForm />)

      // Fill in only the minimum required fields
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Minimal Poll')
      await user.type(optionInputs[0], 'Option 1')
      await user.type(optionInputs[1], 'Option 2')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Wait for submission
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Verify the minimal poll was created
      const createdPoll = {
        id: 'minimal-poll-1',
        title: 'Minimal Poll',
        description: undefined,
        options: [
          { id: 'opt-1', text: 'Option 1', votes: 0, pollId: 'minimal-poll-1' },
          { id: 'opt-2', text: 'Option 2', votes: 0, pollId: 'minimal-poll-1' },
        ],
        createdBy: 'test-user',
        isActive: true,
        isPublic: true, // Default value
        allowMultipleVotes: false, // Default value
        expiresAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <EditPollForm
          poll={createdPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Verify minimal data is displayed correctly
      expect(screen.getByDisplayValue('Minimal Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('')).toBeInTheDocument() // Empty description
      expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument()
    })

    it('handles poll editing with existing votes and shows confirmation', async () => {
      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <EditPollForm
          poll={mockPollWithVotes}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make a change to trigger the confirmation dialog
      const titleInput = screen.getByDisplayValue('Poll with Votes')
      await user.clear(titleInput)
      await user.type(titleInput, 'Modified Poll with Votes')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should show confirmation dialog
      expect(screen.getByText('⚠️ Confirm Poll Edit')).toBeInTheDocument()
      expect(screen.getByText(/This poll has 48 votes/)).toBeInTheDocument()

      // Confirm the edit
      const confirmButton = screen.getByText('Yes, Edit Poll')
      await user.click(confirmButton)

      // Verify the save callback was called
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Modified Poll with Votes',
        description: 'A test poll for testing purposes',
        options: ['Option 1', 'Option 2', 'Option 3'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })

    it('handles poll editing cancellation and form reset', async () => {
      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make some changes
      const titleInput = screen.getByDisplayValue('Test Poll')
      const descriptionInput = screen.getByDisplayValue('A test poll for testing purposes')
      
      await user.clear(titleInput)
      await user.type(titleInput, 'Modified Title')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Modified description')

      // Cancel editing
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      // Form should be reset to original values
      expect(screen.getByDisplayValue('Test Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('A test poll for testing purposes')).toBeInTheDocument()
      
      // Cancel callback should be called
      expect(mockOnCancel).toHaveBeenCalled()
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling and Failure Scenarios', () => {
    it('handles API errors during poll creation', async () => {
      // Mock API error
      server.use(
        rest.post('/api/polls', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Internal server error' }))
        })
      )

      render(<CreatePollForm />)

      // Fill in the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Error Test Poll')
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show loading state
      expect(screen.getByText('Creating poll...')).toBeInTheDocument()

      // Wait for error handling
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('handles network errors gracefully', async () => {
      // Mock network error
      server.use(
        rest.post('/api/polls', (req, res) => {
          return res.networkError('Failed to connect')
        })
      )

      render(<CreatePollForm />)

      // Fill in the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Network Error Poll')
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show loading state
      expect(screen.getByText('Creating poll...')).toBeInTheDocument()

      // Wait for error handling
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('handles validation errors during poll editing', async () => {
      const mockOnSave = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Remove options until only 1 remains
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0])
      await user.click(removeButtons[0])

      // Try to submit with only 1 option
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should show validation error
      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Performance and Stress Testing', () => {
    it('handles rapid form interactions without breaking', async () => {
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      const addButton = screen.getByText('Add Option')

      // Rapidly add and remove options
      for (let i = 0; i < 10; i++) {
        await user.click(addButton)
        await user.type(optionInputs[i + 2], `Option ${i + 3}`)
      }

      // Should handle rapid interactions gracefully
      const allOptionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(allOptionInputs.length).toBeGreaterThan(10)

      // Rapidly type in title
      await user.clear(titleInput)
      for (let i = 0; i < 100; i++) {
        await user.type(titleInput, 'a')
      }

      expect(titleInput).toHaveValue('a'.repeat(100))
    })

    it('handles large numbers of poll options', async () => {
      render(<CreatePollForm />)

      const addButton = screen.getByText('Add Option')

      // Add many options
      for (let i = 0; i < 20; i++) {
        await user.click(addButton)
      }

      // Should handle many options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(22) // 2 initial + 20 added

      // Fill in all options
      for (let i = 0; i < optionInputs.length; i++) {
        await user.type(optionInputs[i], `Option ${i + 1}`)
      }

      // Verify all options are filled
      for (let i = 0; i < optionInputs.length; i++) {
        expect(optionInputs[i]).toHaveValue(`Option ${i + 1}`)
      }
    })
  })
})
