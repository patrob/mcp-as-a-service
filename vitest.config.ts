import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/subscription.ts', 'lib/usage.ts', 'lib/docker.ts', 'lib/database.ts', 'lib/mcp-server-manager.ts', 'lib/servers.ts', 'lib/auth.ts', 'lib/user-service.ts'],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 70,
        functions: 80
      }
    }
  }
})
