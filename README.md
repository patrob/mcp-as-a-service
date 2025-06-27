# mcp-as-a-service
Fun project for spinning up MCP servers as a service.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js 22.x** (use `nvm` for version management)
- **Docker** and **Docker Compose**
- **Git**

### Installing Node.js with nvm

1. Install [nvm](https://github.com/nvm-sh/nvm) if you haven't already
2. Use the correct Node.js version:
   ```bash
   nvm use
   ```
   This will automatically use Node.js 22.x as specified in `.nvmrc`

## Required environment variables

Copy `.env.example` to `.env` and provide values for the following:

- `NEXTAUTH_SECRET` – secret used by NextAuth.
- `GITHUB_CLIENT_ID` – GitHub OAuth client ID.
- `GITHUB_CLIENT_SECRET` – GitHub OAuth client secret.
- `GOOGLE_CLIENT_ID` – Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret.
- `STRIPE_SECRET_KEY` – Stripe API key for charges.
- `STRIPE_CUSTOMER_ID` – ID of the Stripe customer.

See `.env.example` for the complete list of environment variables.

## OAuth configuration

Create OAuth apps with GitHub and Google and record their client IDs and secrets in your `.env` file.

### GitHub
1. Visit [GitHub Developer settings](https://github.com/settings/developers) and create an OAuth application.
2. Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
3. Fill `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` with the generated values.

### Google
1. In the [Google Cloud console](https://console.cloud.google.com/) create OAuth credentials for a Web application.
2. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
3. Fill `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with the created credentials.

Generate `NEXTAUTH_SECRET` using a command such as `openssl rand -base64 32`.

## Getting Started

### 1. Clone and Setup
```bash
git clone <repository-url>
cd mcp-as-a-service
nvm use                    # Use correct Node.js version
npm install               # Install dependencies
```

### 2. Environment Configuration
```bash
cp .env.example .env      # Copy environment template
```
Edit `.env` and fill in the required values (see OAuth configuration section below).

### 3. Start Development Environment
```bash
docker compose up         # Start database, migrations, and web service
```

The application will be available at <http://localhost:3000>.

## Development Commands

All commands should be run with `nvm use` prefix to ensure correct Node.js version:

### Core Development
```bash
nvm use && npm run dev     # Start development server
nvm use && npm run build   # Build for production
nvm use && npm run lint    # Run ESLint
```

### Testing
```bash
nvm use && npm run test               # Run unit tests
nvm use && npm run test:e2e:setup     # Install Playwright browsers (first time only)
nvm use && npm run test:e2e           # Run E2E tests
```

### Docker Development
```bash
docker compose build       # Build containers
docker compose up         # Start all services
docker compose down       # Stop all services
```

