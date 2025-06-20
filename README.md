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

## Setup

1. Install Node dependencies in `app` with `npm install`.
2. Run `docker compose up` to start Postgres, apply migrations and launch the `web` service.

## Building and running

Build the web container and start all services:

```bash
docker compose build
docker compose up
```

Visit <http://localhost:3000> once the containers are running.

## Starting the app

Ensure the variables from your `.env` file are set, then run:

```bash
docker compose up
```

The application will be available at <http://localhost:3000>.

