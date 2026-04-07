---
applyTo: "tests/**"
---

# Test Conventions

## Test Structure
- Use `describe` blocks grouped by endpoint (e.g., `describe('POST /tasks')`)
- Use `it` for individual test cases with descriptive names
- Each test file should call `beforeEach` to reset the database to a clean state

## Database
- Always use in-memory SQLite for tests: `new Database(':memory:')`
- Reset the database before each test using `setDb(new Database(':memory:'))`
- Never rely on state from a previous test — each test must be independent

## HTTP Testing
- Use `supertest` with the imported `app` to make HTTP assertions
- Assert both the status code AND the response body shape
- Test success cases AND error/edge cases for every endpoint

## Error Response Assertions
- Validation errors must return status `400`
- Error responses must match the format: `{ errors: [{ field, message }] }`
- Use `toContainEqual(expect.objectContaining({ field: 'fieldname' }))` to assert error fields

## Patterns to Follow
- For auth-protected routes, test both the authenticated and unauthenticated paths
- For creation endpoints, verify the response includes the created resource with an `id`
- For not-found cases, assert status `404`
