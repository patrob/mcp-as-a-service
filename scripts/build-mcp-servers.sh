#!/bin/bash

# Build all MCP server Docker images

set -e

echo "Building MCP Server Docker images..."

# Build GitHub MCP Server
echo "Building GitHub MCP Server..."
cd mcp-servers/github
docker build -t mcp-github-server:latest .
cd ../..

echo "All MCP server images built successfully!"

# List the built images
echo "Built images:"
docker images | grep "mcp-.*-server"