import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    env: {
      PORT: '3002',
      POSTS: 'tests/fixtures/content/posts',
      CODES: 'tests/fixtures/content/codes',
      PORTFOLIO: 'tests/fixtures/content/portfolio',
      RSS: 'tests/fixtures/content/rss/blog.xml',
      CORS_ORIGIN: 'https://example.com',
    },
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**']
    },
    testTimeout: 10000,
    mockReset: true,
  },
})
