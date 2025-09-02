import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthContext } from '@/contexts/AuthContext'

// Mock poll data for testing
export const mockPoll = {
  id: "test-poll-1",
  title: "Test Poll",
  description: "A test poll for testing purposes",
  options: [
    { id: "opt-1", text: "Option 1", votes: 10, pollId: "test-poll-1" },
    { id: "opt-2", text: "Option 2", votes: 5, pollId: "test-poll-1" },
    { id: "opt-3", text: "Option 3", votes: 0, pollId: "test-poll-1" },
  ],
  createdBy: "test-user",
  isActive: true,
  isPublic: true,
  allowMultipleVotes: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}

export const mockPollWithVotes = {
  ...mockPoll,
  id: "test-poll-2",
  title: "Poll with Votes",
  options: [
    { id: "opt-1", text: "Option 1", votes: 25, pollId: "test-poll-2" },
    { id: "opt-2", text: "Option 2", votes: 15, pollId: "test-poll-2" },
    { id: "opt-3", text: "Option 3", votes: 8, pollId: "test-poll-2" },
  ],
}

export const mockPollInactive = {
  ...mockPoll,
  id: "test-poll-3",
  title: "Inactive Poll",
  isActive: false,
}

// Mock auth context values
export const mockAuthContext = {
  user: {
    id: 'test-user',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
  },
  isAuthenticated: true,
  isLoading: false,
}

export const mockUnauthenticatedContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: typeof mockAuthContext
}

const AllTheProviders = ({ 
  children, 
  authContext = mockAuthContext 
}: { 
  children: React.ReactNode
  authContext?: typeof mockAuthContext
}) => {
  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { authContext, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authContext={authContext}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
