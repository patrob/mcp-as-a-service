# mcp-as-a-service
Fun project for spinning up MCP servers as a service.

## Required environment variables

Copy `.env.example` to `.env` and provide values for the following:

- `NEXTAUTH_SECRET` – secret used by NextAuth.
- `GITHUB_CLIENT_ID` – GitHub OAuth client ID.
- `GITHUB_CLIENT_SECRET` – GitHub OAuth client secret.
- `GOOGLE_CLIENT_ID` – Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret.
- `STRIPE_SECRET_KEY` – Stripe API key for charges.
- `STRIPE_CUSTOMER_ID` – ID of the Stripe customer.

## Setup

1. Install Node dependencies in `app` with `npm install`.
2. Run `docker compose up` to start Postgres, apply migrations and launch the `web` service.

