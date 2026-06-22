import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// Load environment variables from the .env.test file so the suite runs against the hermetic fixtures in tests/fixtures/content, not real content.
config({ path: '.env.test' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**']
    },
    testTimeout: 10000,
    mockReset: true,
  },
})
