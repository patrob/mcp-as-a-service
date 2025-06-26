FROM node:22-slim

WORKDIR /app

# Install dependencies for building native modules
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Create non-root user
RUN useradd -r -s /bin/false mcpuser
RUN chown -R mcpuser:mcpuser /app
USER mcpuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${MCP_SERVER_PORT:-3000}/health || exit 1

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]