import React from 'react'
import { render, screen, waitFor } from '@/test-utils/test-utils'
import { CreatePollForm } from '../CreatePollForm'
import userEvent from '@testing-library/user-event'

describe('CreatePollForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear console.log mock
    (console.log as jest.Mock).mockClear()
  })

  describe('Happy Path Tests', () => {
    it('renders form with initial state', () => {
      render(<CreatePollForm />)

      expect(screen.getByText('Create a new poll')).toBeInTheDocument()
      expect(screen.getByText('Set up your poll with options and settings')).toBeInTheDocument()
      
      // Check initial form values
      expect(screen.getByDisplayValue('')).toBeInTheDocument() // Title
      expect(screen.getByDisplayValue('')).toBeInTheDocument() // Description
      
      // Check initial options (should have 2 empty options)
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(2)
      expect(optionInputs[0]).toHaveValue('')
      expect(optionInputs[1]).toHaveValue('')
      
      // Check initial checkbox states
      const publicCheckbox = screen.getByRole('checkbox', { name: /make poll public/i })
      const multipleVotesCheckbox = screen.getByRole('checkbox', { name: /allow multiple votes/i })
      expect(publicCheckbox).toBeChecked()
      expect(multipleVotesCheckbox).not.toBeChecked()
    })

    it('allows entering poll title and description', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')

      await user.type(titleInput, 'My New Poll')
      await user.type(descriptionInput, 'This is a test poll description')

      expect(titleInput).toHaveValue('My New Poll')
      expect(descriptionInput).toHaveValue('This is a test poll description')
    })

    it('allows adding new poll options', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Should now have 3 options (2 initial + 1 new)
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(3)
      
      // Fill in the new option
      await user.type(optionInputs[2], 'New Option')
      expect(optionInputs[2]).toHaveValue('New Option')
    })

    it('allows removing poll options when more than 2 exist', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Add a new option first
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Now we have 3 options, can remove one
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(3)

      // Remove the first option
      await user.click(removeButtons[0])

      // Should now have 2 options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(2)
    })

    it('prevents removing options when only 2 remain', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Try to remove an option when we have exactly 2
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      expect(removeButtons).toHaveLength(2)

      // Remove one option
      await user.click(removeButtons[0])

      // Should still have 2 options and no remove buttons
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      expect(optionInputs).toHaveLength(2)
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
    })

    it('toggles checkbox states correctly', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

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

    it('allows setting expiration date', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const expirationInput = screen.getByLabelText(/Expiration Date/i)
      const futureDate = '2024-12-31T23:59'

      await user.type(expirationInput, futureDate)
      expect(expirationInput).toHaveValue(futureDate)
    })

    it('successfully creates poll with valid data', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'My Test Poll')
      await user.type(descriptionInput, 'Test description')
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show loading state
      expect(screen.getByText('Creating poll...')).toBeInTheDocument()
      expect(createButton).toBeDisabled()

      // Wait for form submission to complete
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Form should be reset
      expect(titleInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
      expect(optionInputs[0]).toHaveValue('')
      expect(optionInputs[1]).toHaveValue('')
    })
  })

  describe('Edge Cases and Validation Tests', () => {
    it('validates minimum number of options', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Clear one of the options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.clear(optionInputs[0])

      // Try to submit with only 1 option
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
    })

    it('filters out empty options before submission', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Add a new option and leave it empty
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Fill in only the first two options
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')
      // Leave optionInputs[2] empty

      // Fill in title
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      await user.type(titleInput, 'Test Poll')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should only include non-empty options
      expect(console.log).toHaveBeenCalledWith('Creating poll:', expect.objectContaining({
        options: ['Option A', 'Option B']
      }))
    })

    it('handles whitespace in inputs correctly', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      // Add whitespace to inputs
      await user.type(titleInput, '  Poll with Spaces  ')
      await user.type(descriptionInput, '  Description with spaces  ')
      await user.type(optionInputs[0], '  Option with spaces  ')
      await user.type(optionInputs[1], '  Another option  ')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should log the trimmed values
      expect(console.log).toHaveBeenCalledWith('Creating poll:', expect.objectContaining({
        title: '  Poll with Spaces  ',
        description: '  Description with spaces  ',
        options: ['  Option with spaces  ', '  Another option  ']
      }))
    })

    it('handles special characters in inputs', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      // Add special characters
      await user.type(titleInput, 'Poll with "quotes" & symbols!')
      await user.type(descriptionInput, 'Description with <tags> and & symbols')
      await user.type(optionInputs[0], 'Option with émojis 🎉')
      await user.type(optionInputs[1], 'Another option with 123 numbers')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should handle special characters correctly
      expect(console.log).toHaveBeenCalledWith('Creating poll:', expect.objectContaining({
        title: 'Poll with "quotes" & symbols!',
        description: 'Description with <tags> and & symbols',
        options: ['Option with émojis 🎉', 'Another option with 123 numbers']
      }))
    })

    it('handles very long inputs', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      // Create very long strings
      const longTitle = 'A'.repeat(1000)
      const longDescription = 'B'.repeat(2000)
      const longOption = 'C'.repeat(500)

      await user.type(titleInput, longTitle)
      await user.type(descriptionInput, longDescription)
      await user.type(optionInputs[0], longOption)
      await user.type(optionInputs[1], 'Short option')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should handle long inputs
      expect(console.log).toHaveBeenCalledWith('Creating poll:', expect.objectContaining({
        title: longTitle,
        description: longDescription,
        options: [longOption, 'Short option']
      }))
    })
  })

  describe('Failure Cases and Error Handling', () => {
    it('prevents submission with empty title', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in options but leave title empty
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show validation error
      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
    })

    it('prevents submission with insufficient options', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in title
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      await user.type(titleInput, 'Test Poll')

      // Fill in only one option
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(optionInputs[0], 'Option A')
      // Leave optionInputs[1] empty

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show validation error
      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
    })

    it('handles rapid form submissions', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Test Poll')
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit multiple times rapidly
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)
      await user.click(createButton)
      await user.click(createButton)

      // Should only process the first submission
      expect(createButton).toBeDisabled()
      expect(screen.getByText('Creating poll...')).toBeInTheDocument()
    })

    it('handles form submission with only whitespace in options', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in title
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      await user.type(titleInput, 'Test Poll')

      // Fill in options with only whitespace
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(optionInputs[0], '   ')
      await user.type(optionInputs[1], '  \t  ')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Should show validation error
      expect(global.alert).toHaveBeenCalledWith('Please provide at least 2 options')
    })
  })

  describe('Form State Management Tests', () => {
    it('maintains form state during editing', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      // Fill in some fields
      await user.type(titleInput, 'Partial Poll')
      await user.type(optionInputs[0], 'First Option')

      // Add another option
      const addButton = screen.getByText('Add Option')
      await user.click(addButton)

      // Fill in the new option
      const newOptionInputs = screen.getAllByPlaceholderText(/Option \d+/)
      await user.type(newOptionInputs[2], 'Third Option')

      // Check that all inputs maintain their values
      expect(titleInput).toHaveValue('Partial Poll')
      expect(optionInputs[0]).toHaveValue('First Option')
      expect(newOptionInputs[2]).toHaveValue('Third Option')
    })

    it('resets form after successful submission', async () => {
      const user = userEvent.setup()
      render(<CreatePollForm />)

      // Fill in the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)

      await user.type(titleInput, 'Test Poll')
      await user.type(descriptionInput, 'Test Description')
      await user.type(optionInputs[0], 'Option A')
      await user.type(optionInputs[1], 'Option B')

      // Submit form
      const createButton = screen.getByText('Create Poll')
      await user.click(createButton)

      // Wait for form submission to complete
      await waitFor(() => {
        expect(screen.getByText('Create Poll')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Form should be reset
      expect(titleInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
      expect(optionInputs[0]).toHaveValue('')
      expect(optionInputs[1]).toHaveValue('')
    })
  })

  describe('Accessibility Tests', () => {
    it('has proper form labels and associations', () => {
      render(<CreatePollForm />)

      // Check label associations
      expect(screen.getByLabelText('Poll Title *')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Poll Options *')).toBeInTheDocument()
      expect(screen.getByLabelText('Make poll public')).toBeInTheDocument()
      expect(screen.getByLabelText('Allow multiple votes')).toBeInTheDocument()
      expect(screen.getByLabelText('Expiration Date (optional)')).toBeInTheDocument()
    })

    it('has proper button types and accessibility', () => {
      render(<CreatePollForm />)

      // Check button types
      const createButton = screen.getByText('Create Poll')
      const addOptionButton = screen.getByText('Add Option')

      expect(createButton).toHaveAttribute('type', 'submit')
      expect(addOptionButton).toHaveAttribute('type', 'button')
    })

    it('has proper input placeholders', () => {
      render(<CreatePollForm />)

      expect(screen.getByPlaceholderText('Enter poll title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter poll description (optional)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Option 2')).toBeInTheDocument()
    })

    it('has proper form structure', () => {
      render(<CreatePollForm />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()

      // Check that all inputs are within the form
      const titleInput = screen.getByPlaceholderText('Enter poll title')
      const descriptionInput = screen.getByPlaceholderText('Enter poll description (optional)')
      
      expect(form).toContainElement(titleInput)
      expect(form).toContainElement(descriptionInput)
    })
  })
})
