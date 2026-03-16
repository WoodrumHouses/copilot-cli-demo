# Task Manager API

A RESTful task management API built with Node.js, Express, and SQLite.

## Features
- ✅ Full CRUD operations for tasks
- ✅ Task search by keyword
- ✅ Priority levels (low, medium, high)
- ✅ Status tracking (pending, in_progress, done)
- 🚧 User registration and login (not yet implemented)
- 🚧 JWT authentication (not yet implemented)
- 🚧 Input validation (not yet implemented)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite via better-sqlite3
- **Testing:** Jest + Supertest
- **Auth (planned):** bcryptjs + jsonwebtoken

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| GET | `/tasks/search?q=` | Search tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Users (not yet implemented)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | Login and get JWT |
| GET | `/users/profile` | Get current user profile |
| PUT | `/users/profile` | Update user profile |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## Project Structure
```
src/
├── index.js           # Express app entry point
├── db.js              # Database connection and setup
├── routes/
│   ├── tasks.js       # Task route handlers
│   └── users.js       # User route handlers (stubbed)
├── middleware/
│   ├── validate.js    # Input validation (not implemented)
│   └── auth.js        # JWT auth middleware (not implemented)
└── models/
    └── user.js        # User model (partially implemented)

tests/
├── setup.js           # Test database setup
├── tasks.test.js      # Task endpoint tests
├── validate.test.js   # Validation tests (currently failing)
└── users.test.js      # User endpoint tests (stubs only)
```

## Running Tests
```bash
npm test
```

## License
MIT
