import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils'
import { EditPollForm } from '../EditPollForm'
import { mockPoll, mockPollWithVotes, mockPollInactive } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'

describe('EditPollForm', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Clear alert mock
    (global.alert as jest.Mock).mockClear()
  })

  describe('Happy Path Tests', () => {
    it('renders form with existing poll data', () => {
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByText('Edit Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Poll')).toBeInTheDocument()
      expect(screen.getByDisplayValue('A test poll for testing purposes')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Option 3')).toBeInTheDocument()
    })

    it('allows editing poll title and description', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const titleInput = screen.getByDisplayValue('Test Poll')
      const descriptionInput = screen.getByDisplayValue('A test poll for testing purposes')

      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Test Poll')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Updated description')

      expect(titleInput).toHaveValue('Updated Test Poll')
      expect(descriptionInput).toHaveValue('Updated description')
    })

    it('allows adding new poll options', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Should now have 4 options (3 original + 1 new)
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(4)
    })

    it('allows removing poll options when more than 2 exist', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Add a new option first
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Now we have 4 options, can remove one
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(4)

      // Remove the first option
      await user.click(removeButtons[0])

      // Should now have 3 options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(3)
    })

    it('prevents removing options when only 2 remain', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Try to remove an option when we have exactly 3
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(3)

      // Remove one option
      await user.click(removeButtons[0])

      // Should now have 2 options and no remove buttons
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(2)
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
    })

    it('successfully saves changes when form is valid', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make some changes
      const titleInput = screen.getByDisplayValue('Test Poll')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: 'A test poll for testing purposes',
        options: ['Option 1', 'Option 2', 'Option 3'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })

    it('toggles checkbox states correctly', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const publicCheckbox = screen.getByRole('checkbox', { name: /make poll public/i })
      const multipleVotesCheckbox = screen.getByRole('checkbox', { name: /allow multiple votes/i })

      // Initially checked
      expect(publicCheckbox).toBeChecked()
      expect(multipleVotesCheckbox).not.toBeChecked()

      // Toggle them
      await user.click(publicCheckbox)
      await user.click(multipleVotesCheckbox)

      expect(publicCheckbox).not.toBeChecked()
      expect(multipleVotesCheckbox).toBeChecked()
    })
  })

  describe('Edge Cases and Validation Tests', () => {
    it('shows warning when editing poll with existing votes', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPollWithVotes}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make a change to trigger the warning
      const titleInput = screen.getByDisplayValue('Poll with Votes')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should show confirmation dialog
      expect(screen.getByText('⚠️ Confirm Poll Edit')).toBeInTheDocument()
      expect(screen.getByText(/This poll has 48 votes/)).toBeInTheDocument()
      expect(screen.getByText(/Editing options may affect voting results/)).toBeInTheDocument()
    })

    it('requires confirmation before saving when poll has votes', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPollWithVotes}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make a change
      const titleInput = screen.getByDisplayValue('Poll with Votes')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Confirm the edit
      const confirmButton = screen.getByText('Yes, Edit Poll')
      await user.click(confirmButton)

      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: 'A test poll for testing purposes',
        options: ['Option 1', 'Option 2', 'Option 3'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })

    it('prevents editing when poll is inactive', () => {
      render(
        <EditPollForm
          poll={mockPollInactive}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Should show inactive warning
      expect(screen.getByText('❌ This poll is closed and cannot be edited.')).toBeInTheDocument()

      // Form should be disabled
      const form = screen.getByRole('form')
      expect(form).toHaveClass('opacity-50', 'pointer-events-none')
    })

    it('validates minimum number of options', async () => {
      const user = userEvent.setup()
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

      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('filters out empty options before submission', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Add a new option and leave it empty
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Clear one of the existing options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.clear(optionInputs[0])

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should filter out empty options
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'A test poll for testing purposes',
        options: ['Option 2', 'Option 3'], // Option 1 was empty and filtered out
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })

    it('detects when no changes have been made', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Submit without making changes
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      expect(global.alert).toHaveBeenCalledWith('No changes detected')
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('handles expiration date changes correctly', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      const expirationInput = screen.getByLabelText(/Expiration Date/i)
      const futureDate = '2024-12-31T23:59'

      await user.clear(expirationInput)
      await user.type(expirationInput, futureDate)

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'A test poll for testing purposes',
        options: ['Option 1', 'Option 2', 'Option 3'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: futureDate,
      })
    })
  })

  describe('Failure Cases and Error Handling', () => {
    it('handles loading state correctly', () => {
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      )

      const saveButton = screen.getByText('Saving...')
      const cancelButton = screen.getByText('Cancel')

      expect(saveButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })

    it('cancels editing and resets form', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make some changes
      const titleInput = screen.getByDisplayValue('Test Poll')
      await user.clear(titleInput)
      await user.type(titleInput, 'Modified Title')

      // Cancel editing
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      // Form should be reset to original values
      expect(screen.getByDisplayValue('Test Poll')).toBeInTheDocument()
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('handles confirmation dialog cancellation', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPollWithVotes}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Make a change to trigger confirmation
      const titleInput = screen.getByDisplayValue('Poll with Votes')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Cancel the confirmation
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      // Should hide confirmation and not save
      expect(screen.queryByText('⚠️ Confirm Poll Edit')).not.toBeInTheDocument()
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('trims whitespace from inputs before submission', async () => {
      const user = userEvent.setup()
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Add whitespace to inputs
      const titleInput = screen.getByDisplayValue('Test Poll')
      const descriptionInput = screen.getByDisplayValue('A test poll for testing purposes')

      await user.clear(titleInput)
      await user.type(titleInput, '  Test Poll with Spaces  ')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, '  Description with spaces  ')

      // Submit form
      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should trim whitespace
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Test Poll with Spaces',
        description: 'Description with spaces',
        options: ['Option 1', 'Option 2', 'Option 3'],
        isPublic: true,
        allowMultipleVotes: false,
        expiresAt: undefined,
      })
    })
  })

  describe('Accessibility Tests', () => {
    it('has proper form labels and associations', () => {
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Check label associations
      expect(screen.getByLabelText('Poll Title *')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Poll Options *')).toBeInTheDocument()
      expect(screen.getByLabelText('Make poll public')).toBeInTheDocument()
      expect(screen.getByLabelText('Allow multiple votes')).toBeInTheDocument()
      expect(screen.getByLabelText('Expiration Date (optional)')).toBeInTheDocument()
    })

    it('has proper button types and accessibility', () => {
      render(
        <EditPollForm
          poll={mockPoll}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      )

      // Check button types
      const saveButton = screen.getByText('Save Changes')
      const cancelButton = screen.getByText('Cancel')
      const addOptionButton = screen.getByText('Add Option')

      expect(saveButton).toHaveAttribute('type', 'submit')
      expect(cancelButton).toHaveAttribute('type', 'button')
      expect(addOptionButton).toHaveAttribute('type', 'button')
    })
  })
})
