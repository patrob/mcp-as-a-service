import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/subscription.ts', 'lib/usage.ts'],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 70,
        functions: 80
      }
    }
  }
})
