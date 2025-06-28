# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js SaaS application for running MCP (Model Context Protocol) servers as a service. The project uses a Docker-based development environment with PostgreSQL database and Flyway migrations.

### Architecture Overview

- **Frontend**: Next.js 13.5.1 with TypeScript, Tailwind CSS, and Radix UI components
- **Authentication**: NextAuth.js with GitHub and Google OAuth providers
- **Database**: PostgreSQL with Flyway migrations
- **Payments**: Stripe integration for subscription management
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Infrastructure**: Docker Compose for local development

### Key Directories

- `app/`: App router pages and API routes
- `components/`: Reusable React components and UI components
- `lib/`: Core business logic (auth, servers, subscription, usage)
- `e2e/`: Playwright end-to-end tests
- `flyway/sql/`: Database migration files

## Development Commands

All commands should be run from the root directory with `nvm use` prefix to ensure correct Node.js version:

### Core Development
- `nvm use && npm run dev` - Start development server
- `nvm use && npm run build` - Build for production
- `nvm use && npm run start` - Start production server
- `nvm use && npm run lint` - Run ESLint

### Testing
- `nvm use && npm run test` - Run unit tests with Vitest
- `nvm use && npm run test:e2e:setup` - Install Playwright browsers
- `nvm use && npm run test:e2e` - Run E2E tests with Playwright

### Docker Development
- `docker compose up` - Start all services (database, migrations, web)
- `docker compose build` - Build containers

## Code Standards

### Naming Conventions
- PascalCase for types and enum values
- camelCase for functions, methods, properties, and local variables
- Use descriptive, intention-revealing names

### Code Style
- Use arrow functions over anonymous function expressions
- Always use curly braces for loops and conditionals
- Single quotes for internal strings, double quotes for user-facing strings
- No surrounding whitespace in parenthesized constructs
- Do not add comments unless explicitly requested - code should be self-explanatory

### TypeScript Guidelines
- Do not export types or functions unless shared across multiple components
- Do not introduce new types to global namespace
- Follow existing patterns in the codebase

## Testing Requirements

### Unit Tests
- Use Vitest with coverage reporting
- Maintain 80% coverage threshold (90% after initially achieved)
- 3 or fewer assertions per test method
- Follow Arrange-Act-Assert pattern
- Prefer state-based testing over mocks

### E2E Tests
- Use Playwright for end-to-end testing
- Tests run against http://localhost:3000
- Create/update E2E tests for new features

## Authentication & Environment

### Required Environment Variables
- `NEXTAUTH_SECRET` - NextAuth secret
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth
- `STRIPE_SECRET_KEY` & `STRIPE_CUSTOMER_ID` - Stripe integration

### OAuth Setup
- GitHub: Callback URL `http://localhost:3000/api/auth/callback/github`
- Google: Redirect URI `http://localhost:3000/api/auth/callback/google`

## Development Guidelines

### Test-Driven Development (TDD) - MANDATORY
**ALWAYS write tests before implementing features. No exceptions.**

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

### Testing Requirements
- Write unit tests for ALL new business logic functions
- Test both happy path and error cases
- Mock external dependencies (Docker, database, APIs)
- Maintain 80% test coverage minimum (90% target)
- Update vitest.config.ts coverage include list for new modules
- Run `npm test` before any commits

### General Principles
- Follow SOLID principles
- Apply TDD for ALL business logic (not just some)
- Maintain DRY and KISS principles
- Prefer composition over inheritance
- Use vertical slicing for feature organization

### Code Quality
- Methods should have 10 or fewer lines
- Methods should have 3 or fewer parameters
- Classes should have 7 or fewer public members
- No commented-out code
- Run linter and tests before commits

### Dependencies
- Install dependencies via command line: `nvm use && npm install <dependency>`
- Always install dependencies before committing
- Avoid packages requiring commercial licensing

## Database

- PostgreSQL database with Flyway migrations
- Migration files in `flyway/sql/`
- Basic user table schema established in V1__init.sql

## Key Libraries

- UI: Radix UI components with Tailwind CSS
- Forms: React Hook Form with Zod validation
- State: React built-in state management
- Testing: Vitest + Playwright
- Auth: NextAuth.js
- Payments: Stripe

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
NEVER create workflow documentation or README files in .github directories unless explicitly requested.