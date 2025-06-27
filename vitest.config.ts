import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  test: {
    include: ['**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/subscription.ts', 'lib/usage.ts', 'lib/docker.ts', 'lib/database.ts', 'lib/mcp-server-manager.ts', 'lib/servers.ts', 'lib/auth.ts', 'lib/user-service.ts', 'lib/docker-orchestrator.ts'],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 70,
        functions: 80
      }
    }
  }
})
