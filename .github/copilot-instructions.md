# Copilot Instructions for Task Manager API

## Project Overview
This is a Node.js REST API for task management built with Express and SQLite (via better-sqlite3).

## Architecture
- `src/index.js` — Express app entry point
- `src/routes/` — Route handlers (tasks.js, users.js)
- `src/middleware/` — Express middleware (validate.js, auth.js)
- `src/models/` — Database models
- `src/db.js` — Shared database connection
- `tests/` — Jest test suites

## Conventions
- Use parameterized queries for all database operations (never string concatenation)
- Return appropriate HTTP status codes (201 for creation, 204 for deletion, 400 for validation errors)
- All passwords must be hashed with bcrypt before storage
- JWT tokens should include user id and username in the payload
- Validation errors should return `{ errors: [{ field, message }] }` format
- Tests use in-memory SQLite databases (see tests/setup.js)

## Dependencies
- `express` — HTTP framework
- `better-sqlite3` — SQLite driver
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT token generation/verification
- `dotenv` — Environment variable loading
