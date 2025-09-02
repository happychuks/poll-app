# Testing Documentation

This document describes the comprehensive testing setup for the Poll Application, including unit tests, integration tests, and testing utilities.

## Test Structure

The testing infrastructure includes:

- **Unit Tests**: Testing individual components in isolation
- **Integration Tests**: Testing complete workflows and component interactions
- **Mock Service Worker (MSW)**: API mocking for reliable testing
- **Test Utilities**: Common setup and mock data

## Test Files

### Unit Tests

1. **`EditPollForm.test.tsx`** - Comprehensive tests for the poll editing component
   - Happy path scenarios (successful editing, form interactions)
   - Edge cases (editing polls with votes, validation)
   - Failure scenarios (validation errors, loading states)
   - Accessibility testing

2. **`CreatePollForm.test.tsx`** - Comprehensive tests for the poll creation component
   - Form rendering and initial state
   - User interactions (adding/removing options, toggling settings)
   - Validation and error handling
   - Form state management

### Integration Tests

3. **`PollWorkflow.integration.test.tsx`** - End-to-end workflow testing
   - Complete poll lifecycle (create → edit → validate)
   - Component interactions and data flow
   - Error handling and edge cases
   - Performance and stress testing

### Test Infrastructure

4. **`jest.config.js`** - Jest configuration for Next.js
5. **`jest.setup.js`** - Global test setup and mocks
6. **`src/mocks/handlers.ts`** - MSW API handlers for testing
7. **`src/test-utils/test-utils.tsx`** - Test utilities and mock data

## Running Tests

### Prerequisites

The testing setup requires the following packages (already configured):
- Jest
- React Testing Library
- MSW (Mock Service Worker)
- User Event for realistic user interactions

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

## Test Coverage

The tests provide comprehensive coverage including:

### Happy Path Scenarios
- ✅ Successful poll creation with all fields
- ✅ Successful poll editing and updates
- ✅ Form interactions (adding/removing options)
- ✅ Checkbox toggles and settings changes
- ✅ Date/time input handling

### Edge Cases
- ✅ Polls with existing votes (confirmation dialogs)
- ✅ Inactive/closed polls
- ✅ Minimal required fields
- ✅ Large numbers of options
- ✅ Special characters and long inputs
- ✅ Whitespace handling

### Failure Scenarios
- ✅ Validation errors (insufficient options, empty fields)
- ✅ API errors and network failures
- ✅ Loading states and disabled forms
- ✅ Form submission prevention
- ✅ Error message display

### Accessibility
- ✅ Proper form labels and associations
- ✅ Button types and roles
- ✅ Input placeholders and descriptions
- ✅ Form structure and navigation

## Mock Data

The tests use consistent mock data defined in `src/test-utils/test-utils.tsx`:

- **`mockPoll`**: Basic poll with 3 options, no votes
- **`mockPollWithVotes`**: Poll with existing votes (48 total)
- **`mockPollInactive`**: Closed/inactive poll
- **`mockAuthContext`**: Authenticated user context

## API Mocking

MSW provides realistic API mocking for:

- **GET /api/polls** - Fetch all polls
- **GET /api/polls/:id** - Fetch single poll
- **POST /api/polls** - Create new poll
- **PUT /api/polls/:id** - Update existing poll
- **POST /api/polls/:id/vote** - Vote on poll
- **DELETE /api/polls/:id** - Delete poll
- **Error scenarios** - 500 errors, network failures

## Testing Best Practices

### Component Testing
- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features
- Mock external dependencies

### Integration Testing
- Test complete user workflows
- Verify data flow between components
- Test error boundaries and fallbacks
- Validate state consistency

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Test both success and failure paths
- Include edge cases and boundary conditions

## Debugging Tests

### Common Issues
1. **Async operations**: Use `waitFor` for asynchronous state changes
2. **Mock cleanup**: Clear mocks in `beforeEach` hooks
3. **Component rendering**: Ensure proper provider wrapping
4. **User interactions**: Use `userEvent.setup()` for realistic interactions

### Debug Commands
```bash
# Run specific test file
npm test EditPollForm.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="validation"
```

## Continuous Integration

The test suite is configured for CI environments:

- **Coverage thresholds**: 70% minimum coverage
- **CI mode**: No watch mode, generates coverage reports
- **Fail fast**: Tests fail on first error
- **Parallel execution**: Tests run concurrently when possible

## Future Enhancements

Potential areas for test expansion:

- **E2E Testing**: Full browser automation with Playwright
- **Visual Testing**: Component screenshot comparisons
- **Performance Testing**: Load testing for large datasets
- **Accessibility Testing**: Automated a11y compliance checks
- **Internationalization**: Multi-language support testing

## Contributing

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Include both positive and negative test cases
3. Test edge cases and error conditions
4. Maintain test coverage above 70%
5. Update this documentation for new test categories
