import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
  coverage: {
    reporter: ['text', 'lcov'],
    all: true,
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
    include: ['lib/**'],
    exclude: ['components/**', 'hooks/**']
  },
})
