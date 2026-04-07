---
applyTo: "src/routes/**"
---

# Route Conventions

## Security
- ALWAYS use parameterized queries with `?` placeholders — never concatenate user input into SQL strings
- Protect routes that modify user data with the `authenticate` middleware from `../middleware/auth.js`
- Never return `password_hash` or other sensitive fields in API responses

## Input Validation
- Apply the appropriate validation middleware before the route handler
- Import validators from `../middleware/validate.js`
- Validation must happen BEFORE any database operations

## HTTP Status Codes
- `200` — successful retrieval or update
- `201` — successful resource creation
- `204` — successful deletion (no body)
- `400` — validation errors (return `{ errors: [{ field, message }] }`)
- `401` — missing or invalid authentication
- `404` — resource not found
- `500` — unexpected server errors (never leak internal details)

## Error Handling
- Wrap route handlers in try/catch
- Return `{ error: 'message' }` for single errors
- Return `{ errors: [{ field, message }] }` for validation errors
- Never expose stack traces or internal error details to the client

## Route Structure
- Group related routes in a single router file
- Export the router with `module.exports = router`
- Use RESTful naming: plural nouns for resources, HTTP verbs for actions
