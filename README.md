# mcp-as-a-service
Fun project for spinning up MCP servers as a service.

## Local development

Run `docker compose up` to start Postgres and apply migrations.

## Building and running

Build the web container and start all services:

```bash
docker compose build
docker compose up
```

Visit <http://localhost:3000> once the containers are running.

